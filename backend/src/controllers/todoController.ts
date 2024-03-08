import { Request, Response } from 'express';
import TodoService from "../services/TodoService";

export default class TodoController {
    static async index(req: Request, res: Response): Promise<void> {
        try {
            res.json(await TodoService.all());
        } catch (error) {
            throw new Error('Error fetching todos:' + error);
        }
    }
}