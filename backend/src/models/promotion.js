const { DataTypes, Model } = require('sequelize');

class Promotion extends Model {
  static associate(models) {
    Promotion.belongsToMany(models.Product, {through: 'ProductPromotions'});
  }
}

module.exports = (sequelize) => {
  Promotion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'promotions',
      timestamps: true,
    }
  );

  return Promotion;
};
