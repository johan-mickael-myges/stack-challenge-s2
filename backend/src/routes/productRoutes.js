const express = require('express');
const router = express.Router();
const authenticateToken = require('~middlewares/authMiddleware');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('~controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken(['ROLE_ADMIN']), createProduct);
router.put('/:id', authenticateToken(['ROLE_ADMIN']), updateProduct);
router.delete('/:id', authenticateToken(['ROLE_ADMIN']), deleteProduct);

module.exports = router;