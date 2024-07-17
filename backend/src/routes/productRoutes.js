const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const upload = require('~middlewares/uploadMiddleware');

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
router.post('/', checkToken, authorizeRoles(['ROLE_ADMIN']), upload.single('thumbnail'), createProduct);
router.put('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), upload.single('thumbnail'), updateProduct);
router.delete('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), deleteProduct);

module.exports = router;