const { DataTypes, Model } = require('sequelize');
class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.User,{onDelete: 'CASCADE'});
        Order.hasMany(models.OrderItem,{onDelete: 'CASCADE'});
        Order.hasOne(models.Delivery);
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
                allowNull: false
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
