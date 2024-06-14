import express, {Router} from 'express';
import ProductRouter from "./ProductRouter";

const router: Router = express.Router();

// Define routes here
router.use('/products', ProductRouter)

export default router;