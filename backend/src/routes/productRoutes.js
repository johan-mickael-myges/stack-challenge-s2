const express = require('express');
const router = express.Router();
const checkRoles = require('~middlewares/authMiddleware');

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
router.post('/', checkRoles(['ROLE_ADMIN']), createProduct);
router.put('/:id', checkRoles(['ROLE_ADMIN']), updateProduct);
router.delete('/:id', checkRoles(['ROLE_ADMIN']), deleteProduct);

module.exports = router;