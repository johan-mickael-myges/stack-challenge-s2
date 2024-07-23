const express = require('express');
const orderController = require('~controllers/orderController');
const router = express.Router();
const { checkToken } = require('~middlewares/authMiddleware');

router.post('/', checkToken, orderController.createOrder);
router.get('/history', checkToken, orderController.getPaidOrders); 
router.get('/:orderId', checkToken, orderController.getOrderDetails);

module.exports = router;
