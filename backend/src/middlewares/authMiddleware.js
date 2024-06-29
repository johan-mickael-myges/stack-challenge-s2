const jwt = require('jsonwebtoken');
const ForbiddenError = require('~errors/ForbiddenError');
const UnauthorizedError = require('~errors/UnauthorizedError');
const config = require('~config/config');

const authenticateToken = (requiredRoles = []) => {
    return (req, res, next) => {
        const { token } = req.cookies;
        if (!token) {
            return next(new UnauthorizedError());
        }

        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) {
                return next(new UnauthorizedError());
            }

            console.log(user);

            req.user = user;

            if (requiredRoles.length && !requiredRoles.some(role => user.roles.includes(role))) {
                return next(new ForbiddenError());
            }

            next();
        });
    };
};

module.exports = authenticateToken;
