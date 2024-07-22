const express = require('express');
const router = express.Router();
const paymentController = require('~controllers/paymentController');

router.post('/create', paymentController.createOrder);
router.post('/capture', paymentController.captureOrder);

module.exports = router;