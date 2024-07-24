const { DataTypes, Model } = require('sequelize');

class UserAlertItemPreference extends Model {}

module.exports = (sequelize) => {
    UserAlertItemPreference.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                alertId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'alerts',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                itemId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'UserAlertItemPreference',
                tableName: 'user_alert_item_preferences',
                timestamps: false,
            }
    );

    return UserAlertItemPreference;
};