const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('~errors/CustomErrors');
const config = require('~config/config');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Access denied'));
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return next(new UnauthorizedError('Invalid token'));
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
