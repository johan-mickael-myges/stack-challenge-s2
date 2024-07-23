const jwt = require('jsonwebtoken');
const ForbiddenError = require('~errors/ForbiddenError');
const UnauthorizedError = require('~errors/UnauthorizedError');
const { Order } = require('~models');
const config = require('~config/config');

const checkToken = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new UnauthorizedError());
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return next(new UnauthorizedError());
        }

        req.user = user;
        next();
    });
}

const authorizeRoles = (requiredRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ForbiddenError());
        }

        if (requiredRoles.length && !requiredRoles.some(role => req.user.roles.includes(role))) {
            return next(new ForbiddenError());
        }

        next();
    };
};

const checkOrderOwnership = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== req.user.userId) {
            return next(new ForbiddenError());
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkToken,
    authorizeRoles,
    checkOrderOwnership,
};
