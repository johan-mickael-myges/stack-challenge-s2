const {DataTypes, Model} = require('sequelize');

class Role extends Model {
    static associate(models) {
        Role.belongsToMany(models.User, {
            through: 'user_roles',
            foreignKey: 'roleId',
            otherKey: 'userId',
            timestamps: false
        });
    }
}

module.exports = (sequelize) => {
    Role.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: 'Le nom est requis',
                        },
                        len: {
                            args: [1, 255],
                            msg: 'Le nom doit comporter entre 1 et 255 caractères',
                        },
                    }
                },
            },
            {
                sequelize,
                tableName: 'roles',
                timestamps: false
            }
    );

    return Role;
};
