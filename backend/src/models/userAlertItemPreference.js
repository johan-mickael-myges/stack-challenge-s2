const { DataTypes, Model } = require('sequelize');

class UserAlertItemPreference extends Model {
    static associate(models) {
        UserAlertItemPreference.belongsTo(models.UserAlertPreference, {
            foreignKey: 'userAlertPreferenceId',
            as: 'alertPreference',
            onDelete: 'CASCADE'
        });
    }
}

module.exports = (sequelize) => {
    UserAlertItemPreference.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userAlertPreferenceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_alert_preferences',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'UserAlertItemPreference',
        tableName: 'user_alert_item_preferences',
        timestamps: true,
    });

    return UserAlertItemPreference;
};