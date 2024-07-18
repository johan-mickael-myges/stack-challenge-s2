const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateProductCreation, validateProductUpdate } = require('~middlewares/validations/validateProduct');
const upload = require('~middlewares/uploadMiddleware');

const {
    countProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('~controllers/productController');

const stockController = require('~controllers/stockController');

router.get('/count', countProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post
(
    '/',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 3 }]),
    validateProductCreation,
    createProduct
);

router.put(
    '/:id',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 3 }]),
    validateProductUpdate,
    updateProduct
);

router.delete(
    '/:id',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    deleteProduct
);

// ######################### ROUTES FOR STOCKS #########################

router.get(
    '/:id/stocks',
    checkToken,
    authorizeRoles(['ROLE_ADMIN']),
    stockController.allForProduct
);


module.exports = router;