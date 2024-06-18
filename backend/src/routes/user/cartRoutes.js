const express = require('express');
const cartController = require('~controllers/user/cartController');
const router = express.Router();

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/item/:cartItemId', cartController.removeFromCart);
router.put('/item/:cartItemId', cartController.updateCartItem);

module.exports = router;
