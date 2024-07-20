const express = require('express');
const router = express.Router();

const {
    getAllColors,
} = require('~controllers/colorController');

router.get('/', getAllColors);

module.exports = router;