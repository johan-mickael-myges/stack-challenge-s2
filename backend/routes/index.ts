import express, {Router} from 'express';
import helloRouter from './helloworld';

const router: Router = express.Router();

// Define routes here
router.use('/hello', helloRouter);

export default router;