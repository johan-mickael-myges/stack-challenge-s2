const express = require('express');
const router = express.Router();
const paymentController = require('~controllers/paymentController');
const { checkToken } = require('~middlewares/authMiddleware');

router.post('/create', checkToken, paymentController.createOrder);
router.post('/capture', checkToken, paymentController.captureOrder);

module.exports = router;
