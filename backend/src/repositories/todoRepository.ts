import TodoModel, {Todo} from '../models/todoModel';

export default class TodoRepository {
    static async all(): Promise<Todo[]> {
        return TodoModel.find();
    }
}
