// tslint:disable-next-line: no-unused-variable

import {   CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { certToPEM } from '../../auth/utils'
 

const logger = createLogger('auth')

// TODOok: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl2 ='https://dev-ec4r9pjc.us.auth0.com/.well-known/jwks.json'

//'cauOTUZHBpLoRVeGk4lVB2F3v7ZVx-Dfklrg6LXocNhyeYNxeUYvCUJsmfWslcmG'

const jwksUrl=`-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJDpRq6T22W3OaMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1lYzRyOXBqYy51cy5hdXRoMC5jb20wHhcNMjAxMTE4MTIxOTU0WhcN
MzQwNzI4MTIxOTU0WjAkMSIwIAYDVQQDExlkZXYtZWM0cjlwamMudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxkhkmQdBL0drR+u6
quytzHiLJ+JN4sBWrzYj33A3Yipo5a1mrQuR5WXy+HXicA9wDI9eIRNGcu6Stpya
AZ6aaryVqRwZM3hQWG8/97mCkxoGwEgQtkucPzJ7b5oD7JuNpkdWGW6OVd8EBWJq
jS2/o/dbx9DZZhuzn87N+vEz7vsLXWgN66PHtZmmPRPdnLtUTHn8BoUKbwf8gjWK
euPIV9DPwyHePmpDDmmsPtsXydKsndNcbv3fHHaqG2hxNggZP3QQsXoY0wwpE0k5
CIGm97Mk9uXTHYnRJmF0s2nXMzTMJNmkHIFHmeV9ccZHLloNu+Yu/R6t6Rcbn9iS
R9kcNQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSkIx3f7V05
QiKG5r8Z/w5rRrZ8sDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AJCrZZL2F3AH41253whyQGylY9CewcfTtNfVnGZ3GI7gRxk3WjpR4MbY/krfEg0j
VIYirwEVKP8wqvap2zX8p5hvpy+KFBJ/+aS/lBVcOdu+PS3ohSnxBjokajFHA6Dl
Hnxdxk3dO7Di/UutVZnTP7G0nehP6gc7lUc/6KG8Afn8G2ABCr0RfYebtp4P/U1u
4RA0CSYclHfYYMcW2bZEGAr0xewshkR6Hf6BWlv7TVRAUrvlAjz0QjmbAkwpEpyx
UXJTEN1lqkmKLUIpBsFQ3u6p3enLeBGrMEwiC/x/q9cvqnwYVypK5gnFxfILXkQQ
RIPiQu4+g7vslUOsBHJuCsk=
-----END CERTIFICATE-----`// 

export const handler = async (
  event :any 
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', JSON.stringify(event.authorizationToken))
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODOok: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/


  logger.info(jwt)


  const key = await getPublicKey()
return   verify(token,key, { algorithms: ['RS256'] }) as JwtPayload
 
}


 

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
// googled
async function getPublicKey(): Promise<string> {
  const response = await Axios.get(jwksUrl2)
  const jwksKeys = response.data.keys
  if (!jwksKeys || !jwksKeys.length) {
    throw new Error('The JWKS endpoint did not contain any keys')
  }
  const signingKeys = jwksKeys
      .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signature verification
          && key.kty === 'RSA' // We are only supporting RSA (RS256)
          && key.kid           // The `kid` must be present to be useful for later
          && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
      ).map(key => {
        return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
      });

  // If at least one signing key doesn't exist we have a problem... Kaboom.
  if (!signingKeys.length) {
    throw new Error('The JWKS endpoint did not contain any signature verification keys')
  }

  return signingKeys[0].publicKey
}
