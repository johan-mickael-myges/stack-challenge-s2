const bcrypt = require('bcrypt');
const { User } = require('~models');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (!secretKey) {
    throw new Error('JWT_SECRET environment variable is required');
}

exports.registerUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    return await User.create(userData);
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: jwtExpiresIn });

    return { user, token };
};