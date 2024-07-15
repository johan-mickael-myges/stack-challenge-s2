const {DataTypes, Model} = require('sequelize');

class CartItem extends Model {
    static associate(models) {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cartId',
            onDelete: 'CASCADE',
        });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            onDelete: 'CASCADE',
        });
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
                cartId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'carts',
                        key: 'id'
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'products',
                        key: 'id'
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
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
