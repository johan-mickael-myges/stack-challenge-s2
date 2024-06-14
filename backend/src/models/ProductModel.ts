import { Model, DataTypes, ARRAY } from 'sequelize';
import {sequelize} from '../config/database/sequelize'; 
import Category from './CategoryModel';
class Product extends Model {
  public id!: string;
  public name!: string;
  public reference!: string;
  public category_id!: string;
  public brand?: string;
  public price!: number;
  public description?: string | object;
  public images!: string[];
  public promotion_active!: boolean;
  public quantity!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: 'id'
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    promotion_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products', 
    timestamps: true,
  }
);

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export default Product;
