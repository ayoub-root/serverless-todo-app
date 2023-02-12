// tslint:disable-next-line: no-unused-variable

import 'source-map-support/register'
 
import { getUserId } from '../utils'
  
import { APIGatewayProxyEvent, APIGatewayProxyResult,   } from 'aws-lambda'
import * as middy from 'middy' 
import { cors, httpErrorHandler } from 'middy/middlewares'

import {   updateTodo,    } from '../../businessLogic/todosLogics'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
 

 



import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')
 
 

export const handler  =middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  try {
    await updateTodo(todoId, userId, updatedTodo)
    logger.info(`Todo ${todoId} for user ${userId} updated successfully`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Todo updated'
    }
  } catch (e) {
    logger.error(`Todo ${todoId} for user ${userId} updated failed: ${e.message}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
})
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

 