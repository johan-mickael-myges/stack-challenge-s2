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
        Product.hasMany(models.CartItem);
        Product.hasMany(models.OrderItem);
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
                        msg: 'Name is required'
                    },
                    len: {
                        args: [3, 255],
                        msg: 'Name must be between 3 and 255 characters'
                    }
                }
            },
            reference: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: {
                        msg: 'Reference is required'
                    },
                    len: {
                        args: [3, 20],
                        msg: 'Reference must be between 3 and 20 characters'
                    }
                }
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'Price must be a decimal value'
                    },
                    min: {
                        args: [0],
                        msg: 'Price must be a positive value'
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
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                validate: {
                    isUrlArray(value) {
                        if (!Array.isArray(value) || !value.every(url => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url))) {
                            throw new Error('Each image must be a valid URL');
                        }
                    }
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: {
                        msg: 'Quantity must be an integer'
                    },
                    min: {
                        args: [0],
                        msg: 'Quantity cannot be negative'
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
