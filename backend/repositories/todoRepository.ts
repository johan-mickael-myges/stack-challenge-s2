import Todo from '../models/todoModel';

export default class TodoRepository {
    static async all() {
        return Todo.find();
    }
}
