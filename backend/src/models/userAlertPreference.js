const { DataTypes, Model } = require('sequelize');

class UserAlertPreference extends Model {
    static associate(models) {
        UserAlertPreference.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
        UserAlertPreference.belongsTo(models.Alert, {
            foreignKey: 'alertId',
            as: 'alert',
            onDelete: 'CASCADE'
        });
        UserAlertPreference.hasMany(models.UserAlertItemPreference, {
            foreignKey: 'userAlertPreferenceId',
            as: 'alertItemPreferences',
            onDelete: 'CASCADE'
        });
    }
}

module.exports = (sequelize) => {
    UserAlertPreference.init(
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
                enabled: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: 'UserAlertPreference',
                tableName: 'user_alert_preferences',
                timestamps: true,
            }
    );

    return UserAlertPreference;
};