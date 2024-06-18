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
                        msg: 'Name is required',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Name must be between 1 and 255 characters',
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
