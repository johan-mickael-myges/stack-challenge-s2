const express = require('express');
const router = express.Router();
const authenticateToken = require("~middlewares/authMiddleware");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
} = require('~controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateToken(['ROLE_ADMIN']), createCategory);
router.put('/:id', authenticateToken(['ROLE_ADMIN']), updateCategory);
router.delete('/:id', authenticateToken(['ROLE_ADMIN']), deleteCategory);

module.exports = router;
