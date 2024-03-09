import ProductModel, { Product } from '../models/ProductModel';

export default class ProductRepository {
    static async all(): Promise<Product[]> {
        return ProductModel.find();
    }
}
