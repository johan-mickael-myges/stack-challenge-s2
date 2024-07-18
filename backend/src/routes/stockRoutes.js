const express = require('express');
const router = express.Router({ mergeParams: true });
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateStockCreation } = require('~middlewares/validations/validateStock');

const stockController = require('~controllers/stockController');

router.get(
    '/',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    stockController.allForProduct
);

router.get(
    '/count',
    checkToken,
    stockController.countRemainingForProduct
);

router.post(
    '/',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    validateStockCreation,
    stockController.addProductStock
)

module.exports = router;