const express = require('express');
const router = express.Router();

const {
    getAllBrands,
    getBrandById,
    createBrand,
    deleteBrand,
    updateBrand
} = require('~controllers/brandController');

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
