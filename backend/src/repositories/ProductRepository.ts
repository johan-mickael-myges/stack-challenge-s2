import Product from '../models/ProductModel';

export default class ProductRepository {
    static async all(): Promise<Product[]> {
        try {
            return await Product.findAll();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
}
