const { DataTypes, Model } = require('sequelize');

class PasswordResetToken extends Model {
    static associate(models) {
        PasswordResetToken.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = (sequelize) => {
    PasswordResetToken.init(
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
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'PasswordResetToken',
            tableName: 'password_reset_tokens',
            timestamps: true,
        }
    );

    return PasswordResetToken;
}
