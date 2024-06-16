const {DataTypes, Model} = require('sequelize');

class CartItem extends Model {
    static associate(models) {
        CartItem.belongsTo(models.Cart, {onDelete: 'CASCADE'});
        CartItem.belongsTo(models.Product, {onDelete: 'CASCADE'});
    }
}

module.exports = (sequelize) => {
    CartItem.init(
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
        },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'cart_items',
            timestamps: true
        }
    );

    return CartItem;
}
