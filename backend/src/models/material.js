const { DataTypes, Model } = require('sequelize');

class Material extends Model {
    static associate(models) {
        Material.belongsToMany(models.Product, {
            through: 'product_materials',
            foreignKey: 'materialId',
            otherKey: 'productId',
            timestamps: false
        });
    }
}

module.exports = (sequelize) => {
    Material.init(
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
                tableName: 'materials',
                timestamps: true,
            }
    );

    return Material;
};
