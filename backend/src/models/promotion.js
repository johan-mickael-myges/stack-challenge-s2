const {DataTypes, Model} = require('sequelize');

class Promotion extends Model {
    static associate(models) {
        Promotion.belongsToMany(models.Product, {
            through: 'product_promotions',
            foreignKey: 'promotionId',
            otherKey: 'productId',
            timestamps: false
        });
    }
}

module.exports = (sequelize) => {
    Promotion.init(
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
                    }
                }
            },
            discountPercentage: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: {
                        msg: 'Discount percentage must be a float value'
                    },
                    min: {
                        args: [0],
                        msg: 'Discount percentage must be at least 0'
                    },
                    max: {
                        args: [100],
                        msg: 'Discount percentage must be at most 100'
                    }
                }
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: {
                        msg: 'Start date must be a valid date'
                    }
                }
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: {
                        msg: 'End date must be a valid date'
                    },
                    isAfterStartDate(value) {
                        if (this.startDate && new Date(value) <= new Date(this.startDate)) {
                            throw new Error('End date must be after start date');
                        }
                    }
                }
            },
        },
        {
            sequelize,
            tableName: 'promotions',
            timestamps: true,
        }
    );

    return Promotion;
};
