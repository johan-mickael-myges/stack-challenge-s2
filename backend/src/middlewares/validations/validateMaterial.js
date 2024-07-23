const { body, validationResult } = require('express-validator');
const { Material } = require('~models');

const validateMaterial = [
    body('name')
            .notEmpty().withMessage('Le nom est requis')
            .isLength({ min: 1, max: 255 }).withMessage('Le nom doit comporter entre 1 et 255 caractères')
            .custom(async (value, { req }) => {
                const material = await Material.findOne({ where: { name: value } });
                if (material && material.id !== req.body.id) {
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

const validateMaterialCreation = [
    ...validateMaterial,
];

const validateMaterialUpdate = [
    body('id')
            .notEmpty().withMessage('L\'ID est requis')
            .isInt().withMessage('L\'ID doit être un entier'),
    ...validateMaterial,
];

module.exports = {
    validateMaterialCreation,
    validateMaterialUpdate,
};