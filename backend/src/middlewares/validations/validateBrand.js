const { body, validationResult } = require('express-validator');
const { Brand } = require('~models');

const validateBrand = [
    body('name')
            .notEmpty().withMessage('Le nom est requis')
            .isLength({ min: 1, max: 255 }).withMessage('Le nom doit comporter entre 1 et 255 caractères')
            .custom(async (value, { req }) => {
                const brand = await Brand.findOne({ where: { name: value } });
                if (brand && brand.id !== req.body.id) {
                    return Promise.reject('Le nom est déjà utilisé');
                }
            }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        next();
    },
];

const validateBrandCreation = [
    ...validateBrand,
];

const validateBrandUpdate = [
    body('id')
            .notEmpty().withMessage('L\'ID est requis')
            .isInt().withMessage('L\'ID doit être un entier'),
    ...validateBrand,
];

module.exports = {
    validateBrandCreation,
    validateBrandUpdate,
};