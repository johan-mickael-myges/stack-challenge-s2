const express = require('express');
const orderController = require('~controllers/orderController');
const router = express.Router();
const { checkToken, checkOrderOwnership } = require('~middlewares/authMiddleware');

router.post('/', checkToken, orderController.createOrder);
router.get('/history', checkToken, orderController.getPaidOrders); 
router.get('/:orderId', checkToken, checkOrderOwnership, orderController.getOrderDetails);

module.exports = router;
