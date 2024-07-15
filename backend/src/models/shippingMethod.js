const {DataTypes, Model} = require('sequelize');

class ShippingMethod extends Model {
    static associate(models) {
        ShippingMethod.hasMany(models.Delivery, {
            foreignKey: 'shippingMethodId',
            onDelete: 'SET NULL'
        });
    }
}

module.exports = (sequelize) => {
    ShippingMethod.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: 'Le nom est requis'
                        },
                        len: {
                            args: [3, 255],
                            msg: 'Le nom doit comporter entre 3 et 255 caractères'
                        },
                    },
                },
                cost: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        isDecimal: {
                            msg: 'Le coût doit être une valeur décimale'
                        },
                        min: {
                            args: [0],
                            msg: 'Le coût doit être une valeur positive'
                        },
                    },
                },
                minEstimatedDeliveryTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: 'Le temps de livraison estimé minimum doit être un entier'
                        },
                        min: {
                            args: [1],
                            msg: 'Le temps de livraison estimé minimum doit être au moins de 1'
                        }
                    },
                },
                maxEstimatedDeliveryTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: 'Le temps de livraison estimé maximum doit être un entier'
                        },
                        min: {
                            args: [1],
                            msg: 'Le temps de livraison estimé maximum doit être au moins de 1'
                        },
                        isAfterMinDeliveryTime(value) {
                            if (this.minEstimatedDeliveryTime && value < this.minEstimatedDeliveryTime) {
                                throw new Error('Le temps de livraison estimé maximum doit être supérieur ou égal au temps de livraison estimé minimum');
                            }
                        }
                    },
                }
            },
            {
                sequelize,
                modelName: 'ShippingMethod',
                tableName: 'shipping_methods',
                timestamps: true,
            }
    );

    return ShippingMethod;
};
