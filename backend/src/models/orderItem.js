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
                            msg: 'La quantité doit être au moins de 1',
                        },
                    },
                },
                unitPrice: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        isDecimal: {
                            msg: 'Le prix doit être un nombre décimal',
                        },
                        min: {
                            args: [0],
                            msg: 'Le prix doit être au moins de 0',
                        },
                    },
                },
                subtotal: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        isDecimal: {
                            msg: 'Le sous-total doit être un nombre décimal',
                        },
                        min: {
                            args: [0],
                            msg: 'Le sous-total doit être au moins de 0',
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
