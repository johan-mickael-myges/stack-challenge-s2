const {body, validationResult} = require('express-validator');
const {Product} = require('~models');

const validateStockCreation = [
    body('type')
            .notEmpty().withMessage('Le type est requis')
            .isIn(['in', 'out']).withMessage('Le type doit être "in" ou "out"'),
    body('quantity')
            .notEmpty().withMessage('La quantité est requise')
            .isInt({min: -1}).withMessage('La quantité doit être un entier positif'),
    body('id')
            .notEmpty().withMessage('Le produit est requis')
            .isInt().withMessage('Le produit doit être un entier')
            .custom(async (value) => {
                const product = await Product.findByPk(value);
                if (!product) {
                    return Promise.reject('Le produit n\'existe pas');
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

module.exports = {
    validateStockCreation,
};
