const { DataTypes, Model } = require('sequelize');
//et le mdp ?
class User extends Model {
    static associate(models) {
        User.belongsToMany(models.Role, {through: 'user_roles', timestamps: false});
        User.hasMany(models.Address);
        User.hasOne(models.Order);
        User.hasOne(models.Cart);
    }
}

module.exports = (sequelize) => {
    User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                firstname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lastname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: true
                    }
                },
                number: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                sequelize,
                tableName: 'users',
                timestamps: true
            }
    );

    return User;
};
