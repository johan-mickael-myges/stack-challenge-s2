const { DataTypes, Model } = require('sequelize');

class ShippingMethod extends Model {
    static associate(models) {
        ShippingMethod.hasMany(models.Delivery, { onDelete: 'SET NULL'});
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
            minEstimatedDeliveryTime: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            maxEstimatedDeliveryTime: {
                type: DataTypes.INTEGER,
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
