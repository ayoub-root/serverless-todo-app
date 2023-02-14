// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = "cjabij9bu5"
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
//export const apiEndpoint = `http://localhost:3003/dev`

export const authConfig = {
  // TODOok: Create an Auth0 application and copy values from it into this map. For example:
  
  domain: 'dev-ec4r9pjc.us.auth0.com',            // Auth0 domain
  clientId: 'wD1lD2FCHJrC8kPconGGXOu12O91g4zH',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
