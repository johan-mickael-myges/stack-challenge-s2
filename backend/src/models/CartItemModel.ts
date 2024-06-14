import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';
import Product from './ProductModel';
import Cart from './CartModel';

class CartItem extends Model {
  public id!: string;
  public cartId!: string;
  public productId!: string;
  public quantity!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Cart,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true
  }
);

export default CartItem;
