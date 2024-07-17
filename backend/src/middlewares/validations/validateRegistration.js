const { body, validationResult } = require('express-validator');
const { User } = require('~models');

const validateRegistration = [
    body('username').isAlphanumeric().withMessage('Le nom d\'utilisateur doit être alphanumérique')
            .isLength({ min: 3, max: 30 }).withMessage('Le nom d\'utilisateur doit comporter entre 3 et 30 caractères')
            .custom(async (value) => {
                const user = await User.findOne({ where: { username: value } });
                if (user) {
                    return Promise.reject('Le nom d\'utilisateur est déjà utilisé');
                }
            }),
    body('firstname').isAlpha().withMessage('Le prénom ne doit contenir que des lettres')
            .isLength({ min: 2, max: 30 }).withMessage('Le prénom doit comporter entre 2 et 30 caractères'),
    body('lastname').isAlpha().withMessage('Le nom de famille ne doit contenir que des lettres')
            .isLength({ min: 2, max: 30 }).withMessage('Le nom de famille doit comporter entre 2 et 30 caractères'),
    body('email')
            .isEmail().withMessage('Doit être une adresse e-mail valide')
            .custom(async (value) => {
                const user = await User.findOne({ where: { email: value } });
                if (user) {
                    return Promise.reject('L\'adresse e-mail est déjà utilisée');
                }
            }),
    body('number').isNumeric().withMessage('Le numéro de téléphone ne doit contenir que des chiffres')
            .isLength({ min: 10, max: 15 }).withMessage('Le numéro de téléphone doit comporter entre 10 et 15 caractères'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit comporter au moins 8 caractères')
            .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
            .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
            .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
            .matches(/[^A-Za-z0-9]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        next();
    },
];

module.exports = validateRegistration;
