const jwt = require('jsonwebtoken');
const ForbiddenError = require('~errors/ForbiddenError');
const UnauthorizedError = require('~errors/UnauthorizedError');
const config = require('~config/config');

/**
 * Middleware to check user roles
 *
 * @param requiredRoles - array of required roles
 * @param strict - if true, will throw an error if user doesn't have required roles
 * @returns {function(*, *, *): void}
 */
const checkRoles = (requiredRoles = [], strict = true) => {
    return (req, res, next) => {
        const { token } = req.cookies;

        if (!strict && !token) {
            return next();
        }

        if (!token) {
            return next(new UnauthorizedError());
        }

        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (strict && err) {
                return next(new UnauthorizedError());
            }

            req.user = user;

            if (strict && requiredRoles.length && !requiredRoles.some(role => user.roles.includes(role))) {
                return next(new ForbiddenError());
            }

            next();
        });
    };
};

module.exports = checkRoles;
