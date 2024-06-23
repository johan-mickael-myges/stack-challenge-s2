const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('~errors/CustomErrors');

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET environment variable is required');
}

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Access denied'));
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return next(new UnauthorizedError('Invalid token'));
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
