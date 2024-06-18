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
            tableName: 'brands',
            timestamps: true,
        }
    );

    return Brand;
};
