const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateProductCreation, validateProductUpdate } = require('~middlewares/validations/validateProduct');
const upload = require('~middlewares/uploadMiddleware');
const stockRoutes = require('~routes/stockRoutes');

const {
    countProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('~controllers/productController');

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

router.use('/:id/stocks', stockRoutes);

module.exports = router;