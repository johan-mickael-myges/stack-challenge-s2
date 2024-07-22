const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const config = require('../config/config');

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
        const salt = await bcrypt.genSalt(config.passwordSaltRounds);
        return bcrypt.hash(password, salt);
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    toJSON() {
        const user = { ...this.get() };
        delete user.password;
        return user;
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
                    msg: 'Le nom d\'utilisateur est déjà utilisé',
                },
                validate: {
                    isAlphanumeric: {
                        msg: 'Le nom d\'utilisateur doit être alphanumérique',
                    },
                    len: {
                        args: [3, 30],
                        msg: 'Le nom d\'utilisateur doit comporter entre 3 et 30 caractères',
                    },
                },
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlpha: {
                        msg: 'Le prénom ne doit contenir que des lettres',
                    },
                    len: {
                        args: [2, 30],
                        msg: 'Le prénom doit comporter entre 2 et 30 caractères',
                    },
                },
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlpha: {
                        msg: 'Le nom de famille ne doit contenir que des lettres',
                    },
                    len: {
                        args: [2, 30],
                        msg: 'Le nom de famille doit comporter entre 2 et 30 caractères',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: 'L\'email est déjà utilisé',
                },
                validate: {
                    isEmail: {
                        msg: 'Doit être une adresse email valide',
                    },
                },
            },
            number: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'Le numéro doit contenir uniquement des chiffres',
                    },
                    len: {
                        args: [10, 15],
                        msg: 'Le numéro doit comporter entre 10 et 15 caractères',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [8, 100],
                        msg: 'Le mot de passe doit comporter au moins 8 caractères',
                    },
                    isStrongPassword(value) {
                        if (!value.match(/[A-Z]/)) {
                            throw new Error('Le mot de passe doit contenir au moins une lettre majuscule');
                        }
                        if (!value.match(/[a-z]/)) {
                            throw new Error('Le mot de passe doit contenir au moins une lettre minuscule');
                        }
                        if (!value.match(/[0-9]/)) {
                            throw new Error('Le mot de passe doit contenir au moins un chiffre');
                        }
                        if (!value.match(/[^A-Za-z0-9]/)) {
                            throw new Error('Le mot de passe doit contenir au moins un caractère spécial');
                        }
                    },
                },
            },
            cookiesAccepted: {
                type: DataTypes.BOOLEAN,
                defaultValue: null,
                allowNull: true,
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
