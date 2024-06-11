const {Sequelize, DataTypes, Model} = require('sequelize');

class Product extends Model {
    static associate(models) {
        Product.belongsToMany(models.Category, {through: 'productCategories'});
    }
}

module.exports = (sequelize) => {
    Product.init(
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
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: 'products',
            }
    );

    return Product;
};
