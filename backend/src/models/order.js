const { DataTypes, Model } = require('sequelize');
//shippingaddress?
class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.User,{onDelete: 'CASCADE'});
        Order.hasMany(models.OrderItem,{onDelete: 'CASCADE'});
        Order.belongsTo(models.ShippingMethod,{onDelete: 'SET NULL'});
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
            status: {
                type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            paymentMethod: {
                type: DataTypes.ENUM('PAYPAL', 'CARD'),
                allowNull: false
            },
            totalAmount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
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
