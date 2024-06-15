const { DataTypes, Model } = require('sequelize');

class Product extends Model {
    static associate(models) {
        Product.belongsToMany(models.Category, {through: 'product_category', timestamps: false});
        Product.belongsTo(models.Brand);
        Product.belongsToMany(models.Promotion, {through: 'product_promotion'});
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
                    allowNull: false,
                    unique: true
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
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
            },
            {
                sequelize,
                tableName: 'products',
                timestamps: true
            }
    );

    return Product;
};
