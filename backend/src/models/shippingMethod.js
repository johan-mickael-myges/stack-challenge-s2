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
                        msg: 'Name is required'
                    },
                    len: {
                        args: [3, 255],
                        msg: 'Name must be between 3 and 255 characters'
                    },
                },
            },
            cost: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'Cost must be a decimal value'
                    },
                    min: {
                        args: [0],
                        msg: 'Cost must be a positive value'
                    },
                },
            },
            minEstimatedDeliveryTime: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: 'Minimum estimated delivery time must be an integer'
                    },
                    min: {
                        args: [1],
                        msg: 'Minimum estimated delivery time must be at least 1'
                    }
                },
            },
            maxEstimatedDeliveryTime: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: 'Maximum estimated delivery time must be an integer'
                    },
                    min: {
                        args: [1],
                        msg: 'Maximum estimated delivery time must be at least 1'
                    },
                    isAfterMinDeliveryTime(value) {
                        if (this.minEstimatedDeliveryTime && value < this.minEstimatedDeliveryTime) {
                            throw new Error('Maximum estimated delivery time must be greater than or equal to minimum estimated delivery time');
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
