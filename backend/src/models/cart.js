const {DataTypes, Model} = require('sequelize');

class Cart extends Model {
    static associate(models) {
        Cart.belongsTo(models.User, {onDelete: 'CASCADE'});
        Cart.hasMany(models.CartItem, {onDelete: 'CASCADE'});
    }
}

module.exports = (sequelize) => {
    Cart.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'carts',
            timestamps: true,
        }
    );

    return Cart;
};
