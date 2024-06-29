require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({
        path: '.env.local',
    });
}

const config = {
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    development: {
        username: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DB || '',
        host: process.env.POSTGRES_HOST || '',
        dialect: 'postgres',
    },
    test: {
        username: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_TEST_DB || '',
        host: process.env.POSTGRES_HOST || '',
        dialect: 'postgres',
    },
    production: {
        username: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_PROD_DB || '',
        host: process.env.POSTGRES_HOST || '',
        dialect: 'postgres',
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10),
};

if (!config.jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (isNaN(config.passwordSaltRounds)) {
    throw new Error('PASSWORD_SALT_ROUNDS environment variable must be a valid number');
}

module.exports = config;