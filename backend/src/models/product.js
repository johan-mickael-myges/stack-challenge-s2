const {DataTypes, Model} = require('sequelize');

class Product extends Model {
    static associate(models) {
        Product.belongsToMany(models.Category, {
            through: 'product_categories',
            foreignKey: 'productId',
            otherKey: 'categoryId',
            timestamps: false
        });
        Product.belongsTo(models.Brand, {
            foreignKey: 'brandId',
        });
        Product.belongsToMany(models.Promotion, {
            through: 'product_promotions',
            foreignKey: 'productId',
            otherKey: 'promotionId',
            timestamps: false
        });
        Product.hasMany(models.CartItem);
        Product.hasMany(models.OrderItem);
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
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                get() {
                    const value = this.getDataValue('price');
                    return value === null ? null : parseFloat(value);
                },
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
            brandId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'brands',
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
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
