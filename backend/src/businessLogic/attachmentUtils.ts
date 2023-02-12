// tslint:disable-next-line: no-unused-variable

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
  const signedUrlexpiration = process.env.SIGNED_URL_EXPIRATION

  const bucketName = process.env.ATTACHMENT_S3_BUCKET
// TODO: Implement the fileStogare logic
export function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(signedUrlexpiration)
  })
}