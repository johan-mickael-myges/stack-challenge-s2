const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateMaterialCreation, validateMaterialUpdate } = require('~middlewares/validations/validateMaterial');

const {
    countMaterials,
    getAllMaterials,
    getMaterialById,
    createMaterial,
    deleteMaterial,
    updateMaterial
} = require('~controllers/materialController');

router.get('/count', countMaterials);
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', checkToken, authorizeRoles(['ROLE_ADMIN']), validateMaterialCreation, createMaterial);
router.put('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), validateMaterialUpdate, updateMaterial);
router.delete('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), deleteMaterial);


module.exports = router;
