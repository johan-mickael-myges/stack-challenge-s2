import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';
import User from './UserModel';
import ShippingMethod from './ShippingMethodModel';
import Address from '../interfaces/address';

class Order extends Model {
  public id!: string;
  public userId!: string;
  public orderDate!: Date;
  public status!: string;
  public totalAmount!: number;
  public shippingAddress!: Address;
  public shippingMethodId!: string;
  public paymentMethod!: string;
  public createdAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    shippingAddressId: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    shippingMethodId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ShippingMethod, 
        key: 'id'
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('PAYPAL', 'CARD'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true
  }
);

export default Order;
