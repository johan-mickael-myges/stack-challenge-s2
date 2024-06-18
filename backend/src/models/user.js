const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
    static associate(models) {
        User.belongsToMany(models.Role, {
            through: 'user_roles',
            foreignKey: 'userId',
            otherKey: 'roleId',
            timestamps: false
        });
        User.hasMany(models.Order, { foreignKey: 'userId' });
        User.hasOne(models.Cart, { foreignKey: 'userId' });
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
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
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'users',
            timestamps: true,
            hooks: {
                beforeCreate: async (user) => {
                    user.password = await User.hashPassword(user.password);
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        user.password = await User.hashPassword(user.password);
                    }
                }
            }
        }
    );

    return User;
};
