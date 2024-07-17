const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateCategoryCreation, validateCategoryUpdate } = require('~middlewares/validations/validateCategory');

const {
    countCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
} = require('~controllers/categoryController');

router.get('/count', countCategories);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', checkToken, authorizeRoles(['ROLE_ADMIN']), validateCategoryCreation, createCategory);
router.put('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), validateCategoryUpdate, updateCategory);
router.delete('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), deleteCategory);

module.exports = router;
