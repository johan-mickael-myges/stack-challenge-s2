const { DataTypes, Model } = require('sequelize');

class NewsletterSubscription extends Model {}

module.exports = (sequelize) => {
    NewsletterSubscription.init(
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
                subscribed: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: 'NewsletterSubscription',
                tableName: 'newsletter_subscriptions',
                timestamps: false,
            }
    );

    return NewsletterSubscription;
};