const {DataTypes, Model} = require('sequelize');

class Alert extends Model {
    static associate(models) {
        Alert.hasMany(models.UserAlertPreference, {
            foreignKey: 'alertId',
            as: 'userAlertPreferences',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = (sequelize) => {
    Alert.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM('new_product', 'restock', 'price_change', 'newsletter'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Alert',
            tableName: 'alerts',
            timestamps: false,
        }
    );

    return Alert;
};