const {DataTypes, Model} = require('sequelize');

class Brand extends Model {
    static associate(models) {
        Brand.hasMany(models.Product, {
            foreignKey: 'brandId',
            as: 'products',
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
                unique: true
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
