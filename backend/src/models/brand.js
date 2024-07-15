const {DataTypes, Model} = require('sequelize');

class Brand extends Model {
    static associate(models) {
        Brand.hasMany(models.Product, {
            foreignKey: 'brandId',
            as: 'products',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
    }
}

module.exports = (sequelize) => {
    Brand.init(
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
                            args: [1, 255],
                            msg: 'Le nom doit comporter entre 1 et 255 caractères',
                        },
                    },
                }
            },
            {
                sequelize,
                tableName: 'brands',
                timestamps: true,
            }
    );

    return Brand;
};
