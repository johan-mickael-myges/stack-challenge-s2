const bcrypt = require('bcrypt');
const config = require('~config/config');
const { ROLE_ADMIN, ROLE_USER, ROLE_STORE_KEEPER } = require('~constants/roles');
const { User } = require('~models');
const { Role } = require('~models');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('~errors/UnauthorizedError');
const BadRequestError = require('~errors/BadRequestError');

exports.registerUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new BadRequestError('L\'utilisateur existe déjà');
    }

    const user = await User.create(userData);

    const role = await Role.findOne({ where: { id: ROLE_USER } });
    await user.addRole(role);

    return user;
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({
        where: { email },
        include: {
            model: Role,
            attributes: ['name'],
            through: { attributes: [] }
        }
    });

    if (!user) {
        throw new UnauthorizedError('Mot de passe ou email invalide');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError('Mot de passe ou email invalide');
    }

    const roles = user.Roles.map(role => role.name);

    const token = jwt.sign(
            { userId: user.id, roles },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
    );

    return { user, token };
};