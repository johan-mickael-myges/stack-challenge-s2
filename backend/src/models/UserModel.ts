import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database/sequelize';
import Address from '../interfaces/address';

class User extends Model {
  public id!: string;
  public username!: string;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public number?: string;
  public address?: Address;
  public roles!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}


User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    roles: {
      type: DataTypes.ENUM('ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN', 'ROLE_ACCOUNTANT'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
);

export default User;
