const { DataTypes, Model } = require('sequelize');

class ShippingMethod extends Model {
    static associate(models) {
        ShippingMethod.hasMany(models.Order, { onDelete: 'SET NULL'});
    }
}

module.exports = (sequelize) => {
    ShippingMethod.init(
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
                allowNull: true,
            },
            cost: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            estimatedDeliveryTime: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'ShippingMethod',
            tableName: 'shipping_methods',
            timestamps: true,
        }
    );

    return ShippingMethod;
};
