require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost',
    postgres: {
        username: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DB || '',
        host: process.env.POSTGRES_HOST || '',
        dialect: 'postgres',
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10),
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    s3Bucket: process.env.S3_BUCKET,
    sendInBlueApiKey: process.env.SENDINBLUE_API_KEY,
    sendInBlueSender: process.env.SENDINBLUE_SENDER,
    sendInBlueSenderName: process.env.SENDINBLUE_SENDER_NAME,
    mongoURI: process.env.MONGO_URI,
};

if (!config.jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (isNaN(config.passwordSaltRounds)) {
    throw new Error('PASSWORD_SALT_ROUNDS environment variable must be a valid number');
}

module.exports = config;
