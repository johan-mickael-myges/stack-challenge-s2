const { DataTypes, Model } = require('sequelize');

class Role extends Model {
  static associate(models) {
    Role.belongsToMany(models.User, {through: 'UserRole'});
  }
}

module.exports = (sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      timestamps: false
    }
  );

  return Role;
};
