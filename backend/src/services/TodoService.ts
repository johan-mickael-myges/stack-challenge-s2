import TodoRepository from "../repositories/todoRepository";
import { Todo } from "../models/todoModel";

export default class TodoService {
    static async all(): Promise<Todo[]> {
        return await TodoRepository.all();
    }
}