const express = require('express');
const router = express.Router();
const checkRoles = require("~middlewares/authMiddleware");

const {
    getAllBrands,
    getBrandById,
    createBrand,
    deleteBrand,
    updateBrand
} = require('~controllers/brandController');

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', checkRoles(['ROLE_ADMIN']), createBrand);
router.put('/:id', checkRoles(['ROLE_ADMIN']), updateBrand);
router.delete('/:id', checkRoles(['ROLE_ADMIN']), deleteBrand);

module.exports = router;
