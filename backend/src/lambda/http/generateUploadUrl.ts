
// tslint:disable-next-line: no-unused-variable

import 'source-map-support/register'

 
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

 
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { getUserId } from '../utils'
 import { createLogger } from '../../utils/logger'
import { getUserTodo, updateTodoAttachmentUrl } from '../../businessLogic/todosLogics'
import { getUploadUrl } from '../../fileStorage/attachmentUtils'

const logger = createLogger('generateUploadUrl')
const XAWS = AWSXRay.captureAWS(AWS)


 

const bucketName = process.env.ATTACHMENT_S3_BUCKET


export const handler =middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const userId = getUserId(event)

  const todo = await getUserTodo(todoId, userId)
  if(!todo) {
    logger.error(`Todo generate upload url for id ${todoId} failed: Not found`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: `Todo generate upload url failed: Not found, todoid : ${todoId}`
    }
  }
  const uploadUrl = getUploadUrl(todoId)
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await updateTodoAttachmentUrl(todo, attachmentUrl)
  logger.info(`Todo generate upload_url created successfully, todo_id ${todoId}`  )
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl,
      attachmentUrl
    })
  }
})


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
