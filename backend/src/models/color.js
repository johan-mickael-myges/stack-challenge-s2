const { DataTypes, Model } = require('sequelize');

class Color extends Model {
    static associate(models) {
        Color.belongsToMany(models.Product, {
            through: 'product_colors',
            foreignKey: 'colorId',
            otherKey: 'productId',
            timestamps: false
        });
    }
}

module.exports = (sequelize) => {
    Color.init(
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
                    },
                },
            },
            {
                sequelize,
                tableName: 'colors',
                timestamps: true,
            }
    );

    return Color;
};