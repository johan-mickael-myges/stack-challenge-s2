const express = require('express');
const router = express.Router({ mergeParams: true });
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');

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
    stockController.addProductStock
)

module.exports = router;