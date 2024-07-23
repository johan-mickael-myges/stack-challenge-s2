const express = require('express');
const deliveryController = require('~controllers/deliveryController');
const router = express.Router();
const { checkToken } = require('~middlewares/authMiddleware');

router.post('/', checkToken, deliveryController.addDelivery);
router.get('/:id', checkToken, deliveryController.getById)

module.exports = router;
