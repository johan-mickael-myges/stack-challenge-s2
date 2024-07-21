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

    body('weight')
        .notEmpty().withMessage('Le poids est requis')
        .custom((value) => {
            const numberValue = Number(value);
            if (isNaN(numberValue)) {
                return Promise.reject('Le poids doit être une valeur numérique');
            }
            if (numberValue < 0) {
                return Promise.reject('Le poids doit être une valeur positive');
            }
            return true;
        }),

    body('brand')
        .isInt().withMessage('L\'ID de la marque doit être un entier'),

    body('categories')
        .custom((value) => {
            const values = value.split(',');

            if (values.some(category => !Number.isInteger(Number(category)))) {
                return Promise.reject('Les catégories doivent être des entiers');
            }

            if (values.length < 1) {
                return Promise.reject('Au moins une catégorie doit être sélectionnée');
            }

            return true;
        }),

    body('colors')
        .custom((value) => {
            const values = value.split(',');

            if (values.some(color => !Number.isInteger(Number(color)))) {
                return Promise.reject('Les couleurs doivent être des entiers');
            }

            if (values.length < 1) {
                return Promise.reject('Au moins une couleur doit être sélectionnée');
            }

            return true;
        }),

    body('materials')
        .custom((value) => {
            const values = value.split(',');

            if (values.some(material => !Number.isInteger(Number(material)))) {
                return Promise.reject('Les matériaux doivent être des entiers');
            }

            if (values.length < 1) {
                return Promise.reject('Au moins un matériau doit être sélectionné');
            }

            return true;
        }),

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
