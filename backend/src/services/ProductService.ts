import ProductRepository from "../repositories/ProductRepository";
import { Product } from "../models/ProductModel";

export default class ProductService {
    static async all(): Promise<Product[]> {
        return await ProductRepository.all();
    }
}