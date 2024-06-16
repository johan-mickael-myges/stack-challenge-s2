const {DataTypes, Model} = require('sequelize');

class OrderItem extends Model {
    static associate(models) {
        OrderItem.belongsTo(models.Order, {onDelete: 'CASCADE'});
        OrderItem.belongsTo(models.Product, {onDelete: 'CASCADE'});
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
                allowNull: false
            },
            unitPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
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
