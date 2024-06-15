const { DataTypes, Model } = require('sequelize');

class Cart extends Model {
    static associate(models) {
        Cart.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Cart.belongsToMany(models.Product, { through: 'cart_item' });
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
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
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
