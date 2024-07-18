const {DataTypes, Model} = require('sequelize');

class Stock extends Model {
    static associate(models) {
        Stock.belongsTo(models.Product, {
            foreignKey: 'productId',
        });
    }
}

module.exports = (sequelize) => {
    Stock.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM('in', 'out'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Le type est requis'
                },
                isIn: {
                    args: [['in', 'out']],
                    msg: 'Le type doit être "in" ou "out"'
                }
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La quantité est requise'
                },
                min: {
                    args: [0],
                    msg: 'La quantité doit être supérieure ou égale à 0'
                }
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Le produit est requis'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'stocks',
        timestamps: true,
    });

    return Stock;
};
