const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
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
router.post('/', authorizeRoles(['ROLE_ADMIN']), createBrand);
router.put('/:id', authorizeRoles(['ROLE_ADMIN']), updateBrand);
router.delete('/:id', authorizeRoles(['ROLE_ADMIN']), deleteBrand);

module.exports = router;
