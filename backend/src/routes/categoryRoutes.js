const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');

const {
    countCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
} = require('~controllers/categoryController');

router.get('/count', countCategories);
router.get('/', checkToken, getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authorizeRoles(['ROLE_ADMIN']), createCategory);
router.put('/:id', authorizeRoles(['ROLE_ADMIN']), updateCategory);
router.delete('/:id', authorizeRoles(['ROLE_ADMIN']), deleteCategory);

module.exports = router;
