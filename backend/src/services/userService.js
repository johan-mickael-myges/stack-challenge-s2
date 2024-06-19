const { User } = require('~models');

exports.registerUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    return await User.create(userData);
};
