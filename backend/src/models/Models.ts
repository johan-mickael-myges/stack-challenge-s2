import { ModelStatic } from 'sequelize';
import Product from './ProductModel';
import Category from './CategoryModel';

export default interface Models {
    Category: Category;
    Product: Product;
  }