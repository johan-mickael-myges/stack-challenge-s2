import express, {Router} from 'express';
import ProductController from "../controllers/ProductController";

const productRouter: Router = express.Router();

productRouter.get('/', ProductController.index);

export default productRouter;