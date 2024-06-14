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
                reference: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                price: {
                    type: DataTypes.DECIMAL(10,2),
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                images: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                    allowNull: false,
                    defaultValue: []
                }
            },
            {
                sequelize,
                tableName: 'products',
            }
    );

    return Product;
};
