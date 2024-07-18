const {DataTypes, Model} = require('sequelize');
const { STOCK_TYPE_IN, STOCK_TYPE_OUT } = require('../constants/stock');

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
            type: DataTypes.ENUM(STOCK_TYPE_IN, STOCK_TYPE_OUT),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Le type est requis'
                },
                isIn: {
                    args: [[STOCK_TYPE_IN, STOCK_TYPE_OUT]],
                    msg: 'Le type est invalide'
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
        tableName: 'stocks',
        modelName: 'Stock',
        timestamps: true,
    });

    return Stock;
};
