const express = require('express');
const router = express.Router();

const {
    getAllMaterials,
} = require('~controllers/materialController');

router.get('/', getAllMaterials);

module.exports = router;