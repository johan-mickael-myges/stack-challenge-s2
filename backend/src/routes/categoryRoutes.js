const express = require('express');
const router = express.Router();
const checkRoles = require("~middlewares/authMiddleware");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
} = require('~controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', checkRoles(['ROLE_ADMIN']), createCategory);
router.put('/:id', checkRoles(['ROLE_ADMIN']), updateCategory);
router.delete('/:id', checkRoles(['ROLE_ADMIN']), deleteCategory);

module.exports = router;
