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
        const salt = await bcrypt.genSalt(process.env.PASSWORD_SALT_ROUNDS);
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
                unique: {
                    msg: 'Username already in use',
                },
                validate: {
                    isAlphanumeric: {
                        msg: 'Username must be alphanumeric',
                    },
                    len: {
                        args: [3, 30],
                        msg: 'Username must be between 3 and 30 characters',
                    },
                },
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlpha: {
                        msg: 'Firstname must contain only letters',
                    },
                    len: {
                        args: [2, 30],
                        msg: 'Firstname must be between 2 and 30 characters',
                    },
                },
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlpha: {
                        msg: 'Lastname must contain only letters',
                    },
                    len: {
                        args: [2, 30],
                        msg: 'Lastname must be between 2 and 30 characters',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: 'Email already in use',
                },
                validate: {
                    isEmail: {
                        msg: 'Must be a valid email address',
                    },
                },
            },
            number: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'Number must contain only numbers',
                    },
                    len: {
                        args: [10, 15],
                        msg: 'Number must be between 10 and 15 characters',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [8, 100],
                        msg: 'Password must be at least 8 characters long',
                    },
                    isStrongPassword(value) {
                        if (!value.match(/[A-Z]/)) {
                            throw new Error('Password must contain at least one uppercase letter');
                        }
                        if (!value.match(/[a-z]/)) {
                            throw new Error('Password must contain at least one lowercase letter');
                        }
                        if (!value.match(/[0-9]/)) {
                            throw new Error('Password must contain at least one digit');
                        }
                        if (!value.match(/[^A-Za-z0-9]/)) {
                            throw new Error('Password must contain at least one special character');
                        }
                    },
                },
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
