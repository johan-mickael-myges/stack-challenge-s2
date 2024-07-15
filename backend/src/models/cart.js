const {DataTypes, Model} = require('sequelize');

class Cart extends Model {
    static associate(models) {
        Cart.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
        Cart.hasMany(models.CartItem, {
            foreignKey: 'cartId',
            onDelete: 'CASCADE',
        });
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
