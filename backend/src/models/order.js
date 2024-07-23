const { DataTypes, Model } = require('sequelize');

class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            onDelete: 'CASCADE'
        });
        Order.hasOne(models.Delivery, {
            foreignKey: 'orderId'
        });
    }
}

module.exports = (sequelize) => {
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            paymentMethod: {
                type: DataTypes.ENUM('PAYPAL', 'CARD'),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['PAYPAL', 'CARD']],
                        msg: 'Le mode de paiement doit être PAYPAL ou CARD',
                    },
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            paymentStatus: {
                type: DataTypes.ENUM('paid', 'not paid'),
                allowNull: false,
                defaultValue: 'not paid'
            }
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            timestamps: true,
        }
    );

    return Order;
};
