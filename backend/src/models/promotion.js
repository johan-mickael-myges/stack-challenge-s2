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
                            msg: 'Le nom est requis'
                        },
                        len: {
                            args: [3, 255],
                            msg: 'Le nom doit comporter entre 3 et 255 caractères'
                        }
                    }
                },
                discountPercentage: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: 'Le pourcentage de réduction doit être une valeur flottante'
                        },
                        min: {
                            args: [0],
                            msg: 'Le pourcentage de réduction doit être au moins de 0'
                        },
                        max: {
                            args: [100],
                            msg: 'Le pourcentage de réduction doit être au plus de 100'
                        }
                    }
                },
                startDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: {
                            msg: 'La date de début doit être une date valide'
                        }
                    }
                },
                endDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: {
                            msg: 'La date de fin doit être une date valide'
                        },
                        isAfterStartDate(value) {
                            if (this.startDate && new Date(value) <= new Date(this.startDate)) {
                                throw new Error('La date de fin doit être après la date de début');
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
