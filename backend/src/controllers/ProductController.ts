import { Request, Response } from 'express';
import ProductService from "../services/ProductService";

export default class ProductController {
    static async index(req: Request, res: Response): Promise<void> {
        try {
            res.json(await ProductService.all());
        } catch (error) {
            throw new Error('Error fetching products:' + error);
        }
    }
}