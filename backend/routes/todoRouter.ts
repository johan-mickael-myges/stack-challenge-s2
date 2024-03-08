import express, {Router} from 'express';
import TodoController from "../controllers/todoController";

const todoRouter: Router = express.Router();

// Define routes here
todoRouter.get('/', TodoController.index);

export default todoRouter;