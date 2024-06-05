import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';
import User from './UserModel';

class Cart extends Model {
  public id!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Cart.init(
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
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true
  }
);

export default Cart;
