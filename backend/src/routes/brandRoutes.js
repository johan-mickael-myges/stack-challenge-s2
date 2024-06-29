const express = require('express');
const router = express.Router();
const authenticateToken = require("~middlewares/authMiddleware");

const {
    getAllBrands,
    getBrandById,
    createBrand,
    deleteBrand,
    updateBrand
} = require('~controllers/brandController');

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', authenticateToken(['ROLE_ADMIN']), createBrand);
router.put('/:id', authenticateToken(['ROLE_ADMIN']), updateBrand);
router.delete('/:id', authenticateToken(['ROLE_ADMIN']), deleteBrand);

module.exports = router;
