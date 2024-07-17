const {DataTypes, Model} = require('sequelize');

class Category extends Model {
    static associate(models) {
        Category.belongsToMany(models.Product, {
            through: 'product_categories',
            foreignKey: 'categoryId',
            otherKey: 'productId',
            timestamps: false
        });
    }
}

module.exports = (sequelize) => {
    Category.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: 'Le nom est requis',
                        },
                        len: {
                            args: [3, 255],
                            msg: 'Le nom doit comporter entre 3 et 255 caractères',
                        },
                    },
                }
            },
            {
                sequelize,
                tableName: 'categories',
                timestamps: true
            }
    );

    return Category;
};
