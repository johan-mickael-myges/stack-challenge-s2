const { Sequelize, DataTypes, Model } = require('sequelize');

class Category extends Model {
    static associate(models) {
        Category.belongsToMany(models.Product, { through: 'productCategories' });
    }
}

module.exports = (sequelize) => {
    Category.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: 'categories',
            }
    );

    return Category;
};
