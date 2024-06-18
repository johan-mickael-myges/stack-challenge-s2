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
                        msg: 'Name is required',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Name must be between 1 and 255 characters',
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
