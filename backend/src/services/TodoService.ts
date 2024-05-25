import TodoRepository from "../repositories/todoRepository";
import { Todo } from '../interfaces';

export default class TodoService {
    static async all(): Promise<Todo[]> {
        return await TodoRepository.all();
    }
}