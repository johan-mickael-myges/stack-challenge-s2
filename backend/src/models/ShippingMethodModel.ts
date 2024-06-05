import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';

class ShippingMethod extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
  public estimatedDeliveryTime!: number;
  public cost!: number;
}

ShippingMethod.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estimatedDeliveryTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ShippingMethod',
    tableName: 'shipping_methods',
    timestamps: false
  }
);

export default ShippingMethod;
