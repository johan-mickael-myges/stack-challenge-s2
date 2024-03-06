import express, {Router} from 'express';
import { helloWorldRoute } from './helloworld';

const router: Router = express.Router();

// Define routes here
router.get('/hello', helloWorldRoute);

export default router;