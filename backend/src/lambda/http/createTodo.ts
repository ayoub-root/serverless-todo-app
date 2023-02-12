// tslint:disable-next-line: no-unused-variable

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todosLogics'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createNewTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
  
    
  const userId = getUserId(event)

  try {
    const todoCreated = await createTodo(newTodo, userId)
    logger.info(`Todo is created successfully for for user ${userId}`)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: todoCreated
      })
    }
  } catch (e) {
    logger.error(`Todo creation is failed, msg:${e.message} user: ${userId}`)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
  
  }
)

handler.use(
  cors({
    credentials: true
  })
)
