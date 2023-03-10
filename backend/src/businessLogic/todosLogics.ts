import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
 import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodosAccess } from '../dataLayer/todosAcessLayer'

const todoAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId)
}

export async function getUserTodo(todoId: string, userId: string): Promise<TodoItem> {
    return await todoAccess.getUserTodo(todoId, userId)
}

export async function createTodo(
     createTodoRequest: CreateTodoRequest,
     userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        createdAt: new Date().toISOString()
    })
}

export async function updateTodo(
    todoId: string,
    userId: string,
    updateTodoRequest: UpdateTodoRequest
) {
    const todoToUpdate = await todoAccess.getUserTodo(todoId, userId)
    if(!todoToUpdate){
        throw new Error('Todo not found')
    }
    await todoAccess.updateTodo(todoToUpdate, updateTodoRequest)
}

export async function updateTodoAttachmentUrl(
    todo: TodoItem,
    attachmentUrl: string
) {
    await todoAccess.updateTodoAttachmentUrl(todo, attachmentUrl)
}

export async function deleteTodo(
    todoId: string,
    userId: string
) {
    const todoToDelete = await todoAccess.getUserTodo(todoId, userId)
    if(!todoToDelete){
        throw new Error('Todo not found')
    }
    await todoAccess.deleteTodo(todoToDelete)
}
