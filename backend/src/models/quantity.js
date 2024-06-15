const { DataTypes, Model } = require('sequelize');

class Quantity extends Model {
  static associate(models) {
    Quantity.belongsTo(models.Product);
  }
}

module.exports = (sequelize) => {
  Quantity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    },
    {
      sequelize,
      tableName: 'quantities',
      timestamps: true,
    }
  );

  return Quantity;
};
