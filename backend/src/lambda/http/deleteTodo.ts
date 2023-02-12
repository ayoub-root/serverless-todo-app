// tslint:disable-next-line: no-unused-variable

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todosLogics'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('removeTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    
    const userId = getUserId(event)

    try {
      await deleteTodo(todoId, userId)
      logger.info(`Todo ${todoId} for user ${userId} deleted successfully`)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'Todo deleted'
      }
    } catch (e) {
      logger.error(`Todo ${todoId} created by user ${userId} deletion failed: ${e.message}`)
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: e.message
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
