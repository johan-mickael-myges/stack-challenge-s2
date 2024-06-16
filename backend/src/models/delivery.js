const {DataTypes, Model} = require('sequelize');

class Delivery extends Model {
    static associate(models) {
        Delivery.belongsTo(models.ShippingMethod, {
            foreignKey: 'shippingMethodId',
            onDelete: 'SET NULL',
        });
        Delivery.belongsTo(models.Order, {
            foreignKey: 'orderId'
        });
    }
}

module.exports = (sequelize) => {
    Delivery.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipientName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            shippingMethodId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'shipping_methods',
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            },
            orderId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'orders',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
        },
        {
            sequelize,
            modelName: 'Delivery',
            tableName: 'deliveries',
            timestamps: true,
        }
    );

    return Delivery;
};
