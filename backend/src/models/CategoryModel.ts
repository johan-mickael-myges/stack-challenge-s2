import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../config/database/sequelize';
import Product from './ProductModel';
class Category extends Model {
  public id!: string;
  public name!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  }
);

//Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

export default Category;
