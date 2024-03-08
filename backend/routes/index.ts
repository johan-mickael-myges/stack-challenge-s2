import express, {Router} from 'express';
import helloRouter from './helloworld';
import todoRouter from "./todoRouter";

const router: Router = express.Router();

// Define routes here
router.use('/hello', helloRouter);
router.use('/todos', todoRouter);

export default router;