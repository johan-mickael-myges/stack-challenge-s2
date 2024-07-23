const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const { validateColorCreation, validateColorUpdate } = require('~middlewares/validations/validateColor');

const {
    countColors,
    getAllColors,
    getColorById,
    createColor,
    deleteColor,
    updateColor
} = require('~controllers/colorController');

router.get('/count', countColors);
router.get('/', getAllColors);
router.get('/:id', getColorById);
router.post('/', checkToken, authorizeRoles(['ROLE_ADMIN']), validateColorCreation, createColor);
router.put('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), validateColorUpdate, updateColor);
router.delete('/:id', checkToken, authorizeRoles(['ROLE_ADMIN']), deleteColor);


module.exports = router;
