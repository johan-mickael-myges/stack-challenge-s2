const { DataTypes, Model } = require('sequelize');

class Address extends Model {
    static associate(models) {
        Address.belongsTo(models.User);
    }
}

module.exports = (sequelize) => {
    Address.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postalCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            recipientName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isFavorite: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            tableName: 'addresses',
            timestamps: true,
        }
    );

    return Address;
};
