const {DataTypes, Model} = require('sequelize');

class Product extends Model {
    static associate(models) {
        Product.belongsToMany(models.Category, {
            through: 'product_categories',
            foreignKey: 'productId',
            otherKey: 'categoryId',
            timestamps: false
        });
        Product.belongsTo(models.Brand, {
            foreignKey: 'brandId',
        });
        Product.belongsToMany(models.Promotion, {
            through: 'product_promotions',
            foreignKey: 'productId',
            otherKey: 'promotionId',
            timestamps: false
        });
        Product.hasMany(models.CartItem, { foreignKey: 'productId' });
        Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
    }
}

module.exports = (sequelize) => {
    Product.init(
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
                reference: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: 'La référence est requise'
                        },
                        len: {
                            args: [3, 20],
                            msg: 'La référence doit comporter entre 3 et 20 caractères'
                        }
                    }
                },
                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        isDecimal: {
                            msg: 'Le prix doit être une valeur décimale'
                        },
                        min: {
                            args: [0],
                            msg: 'Le prix doit être une valeur positive'
                        }
                    },
                    get() {
                        const value = this.getDataValue('price');
                        return value === null ? null : parseFloat(value);
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                thumbnail: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isUrl: {
                            msg: 'La miniature doit être une URL valide'
                        }
                    }
                },
                images: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                    allowNull: true,
                    validate: {
                        isUrlArray(value) {
                            if (!value) {
                                return;
                            }

                            if (!Array.isArray(value) || !value.every(url => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url))) {
                                throw new Error('Chaque image doit être une URL valide');
                            }
                        }
                    }
                },
                brandId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'brands',
                        key: 'id'
                    },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                },
            },
            {
                sequelize,
                tableName: 'products',
                timestamps: true
            }
    );

    return Product;
};
