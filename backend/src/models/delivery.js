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
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Recipient name is required',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Recipient name must be between 1 and 255 characters',
                    },
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Address is required',
                    },
                },
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
                validate: {
                    isIn: {
                        args: [['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']],
                        msg: 'Status must be one of PENDING, SHIPPED, DELIVERED, CANCELLED',
                    },
                },
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
