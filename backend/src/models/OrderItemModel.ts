import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';
import Order from './OrderModel';
import Product from './ProductModel';

class OrderItem extends Model {
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public quantity!: number;
  public unitPrice!: number;
  public subtotal!: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Order,
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
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: false
  }
);

export default OrderItem;
