import ProductModel from '../models/ProductModel';
import { Product } from '../interfaces';

export default class ProductRepository {
    static async all(): Promise<Product[]> {
        return ProductModel.find();
    }
}
