import express, {Router} from 'express';
import { sayHello } from "../controllers/helloWorldController";

const helloRouter: Router = express.Router();

// Define routes here
helloRouter.get('/', sayHello);

export default helloRouter;