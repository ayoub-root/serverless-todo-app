// tslint:disable-next-line: no-unused-variable

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todosLogics'
import { getUserId } from '../utils';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todosLogics'
import { createLogger } from '../../utils/logger'
//import { createTodo } from '../../businessLogic/todos'
const logger = createLogger('getTodos')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    logger.info('Processing event: ', event)

    const userId = getUserId(event)
    console.log("dddddddddddd "+userId)
    const items = await getTodosForUser(userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify( {
            items: items,user:userId
        })
    }

  }
   
)

handler.use(
  cors({
    credentials: true
  })
)
