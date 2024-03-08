import express, {Router} from 'express';
import TodoController from "../controllers/todoController";

const todoRouter: Router = express.Router();

todoRouter.get('/', TodoController.index);

export default todoRouter;