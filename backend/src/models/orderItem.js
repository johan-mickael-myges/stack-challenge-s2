const {DataTypes, Model} = require('sequelize');

class OrderItem extends Model {
    static associate(models) {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            onDelete: 'CASCADE',
        });
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = (sequelize) => {
    OrderItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: {
                        args: [1],
                        msg: 'Quantity must be at least 1',
                    },
                },
            },
            unitPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'Price must be a decimal number',
                    },
                    min: {
                        args: [0],
                        msg: 'Price must be at least 0',
                    },
                },
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'Subtotal must be a decimal number',
                    },
                    min: {
                        args: [0],
                        msg: 'Subtotal must be at least 0',
                    },
                },
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
            productId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'products',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'order_items',
            timestamps: true
        }
    );

    return OrderItem;
}
