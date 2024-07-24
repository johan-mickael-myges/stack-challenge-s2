const { DataTypes, Model } = require('sequelize');

class AlertTrigger extends Model {}

module.exports = (sequelize) => {
    AlertTrigger.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
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
                triggerDate: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                modelName: 'AlertTrigger',
                tableName: 'alert_triggers',
                timestamps: false,
            }
    );

    return AlertTrigger;
};