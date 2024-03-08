import { Request, Response } from 'express';
import TodoRepository from "../repositories/todoRepository";

export default class TodoController {
    static async index(req: Request, res: Response) {
        try {
            res.json(await TodoRepository.all());
        } catch (error) {
            throw new Error('Error fetching todos:' + error);
        }
    }
}