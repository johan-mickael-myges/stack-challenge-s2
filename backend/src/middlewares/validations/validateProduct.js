const { body, validationResult } = require('express-validator');
const { Product } = require('~models');

const validateProduct = [
    body('name')
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 3, max: 255 }).withMessage('Le nom doit comporter entre 3 et 255 caractères'),
    body('price')
        .notEmpty().withMessage('Le prix est requis')
        .custom((value) => {
            const numberValue = Number(value);
            if (isNaN(numberValue)) {
                return Promise.reject('Le prix doit être une valeur numérique');
            }
            if (numberValue < 0) {
                return Promise.reject('Le prix doit être une valeur positive');
            }
            return true;
        }),
    body('description')
            .optional()
            .isString(),
    body('brandId')
            .optional()
            .isInt().withMessage('L\'ID de la marque doit être un entier'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        next();
    },
];

const validateProductCreation = [
    body('reference')
        .notEmpty().withMessage('La référence est requise')
        .isLength({ min: 3, max: 20 }).withMessage('La référence doit comporter entre 3 et 20 caractères')
        .custom(async (value, { req }) => {
            const product = await Product.findOne({ where: { reference: value } });
            if (product && product.id !== req.body.id) {
                return Promise.reject('La référence est déjà utilisée');
            }
        }),
    ...validateProduct,
];

const validateProductUpdate = [
    body('id')
        .notEmpty().withMessage('L\'ID est requis')
        .isInt().withMessage('L\'ID doit être un entier'),
    body('reference')
        .notEmpty().withMessage('La référence est requise')
        .isLength({ min: 3, max: 20 }).withMessage('La référence doit comporter entre 3 et 20 caractères')
        .custom(async (value, { req }) => {
            const product = await Product.findOne({ where: { reference: value } });
            if (product && product.id !== Number(req.body.id)) {
                return Promise.reject('La référence est déjà utilisée');
            }
        }),
    ...validateProduct,
];


module.exports = {
    validateProductCreation,
    validateProductUpdate,
};
