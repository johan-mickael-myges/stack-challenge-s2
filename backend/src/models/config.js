const {DataTypes} = require('sequelize');

const {Model} = require('sequelize');

class Config extends Model {}

module.exports = (sequelize) => {
    Config.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            tableName: 'configs',
            timestamps: false
        }
    );

    return Config;
};