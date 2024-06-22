const { body, validationResult } = require('express-validator');
const { User } = require('~models');

const validateRegistration = [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric')
            .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
            .custom(async (value) => {
                const user = await User.findOne({ where: { username: value } });
                if (user) {
                    return Promise.reject('Username already in use');
                }
            }),
    body('firstname').isAlpha().withMessage('Firstname must contain only letters')
            .isLength({ min: 2, max: 30 }).withMessage('Firstname must be between 2 and 30 characters'),
    body('lastname').isAlpha().withMessage('Lastname must contain only letters')
            .isLength({ min: 2, max: 30 }).withMessage('Lastname must be between 2 and 30 characters'),
    body('email')
            .isEmail().withMessage('Must be a valid email address')
            .custom(async (value) => {
                const user = await User.findOne({ where: { email: value } });
                if (user) {
                    return Promise.reject('E-mail already in use');
                }
            }),
    body('number').isNumeric().withMessage('Number must contain only numbers')
            .isLength({ min: 10, max: 15 }).withMessage('Number must be between 10 and 15 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[0-9]/).withMessage('Password must contain at least one digit')
            .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = validateRegistration;