const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateBrandCreation, validateBrandUpdate } = require('~middlewares/validations/validateBrand');

const {
    countBrands,
    getAllBrands,
    getBrandById,
    createBrand,
    deleteBrand,
    updateBrand
} = require('~controllers/brandController');

router.get('/count', countBrands);
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', checkToken, authorizeRoles(['ROLE_ADMIN']), validateBrandCreation, createBrand);
router.put('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), validateBrandUpdate, updateBrand);
router.delete('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), deleteBrand);


module.exports = router;
