const { DataTypes, Model } = require('sequelize');

class Product extends Model {
    static associate(models) {
        Product.belongsToMany(models.Category, {through: 'productCategories'});
        Product.belongsTo(models.Brand);
        Product.hasOne(models.Quantity);
        Product.belongsToMany(models.Promotion, {through: 'ProductPromotions'});
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
            },
            {
                sequelize,
                tableName: 'products',
                timestamps: true
            }
    );

    return Product;
};
