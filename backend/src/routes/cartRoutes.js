const express = require('express');
const cartController = require('~controllers/cartController');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');

router.post('/', checkToken, cartController.addToCart);
router.get('/', checkToken, cartController.getCartItems);
router.delete('/:productId', checkToken, cartController.removeFromCart);
router.patch('/:productId', checkToken, cartController.updateCartItemQuantity);

module.exports = router;
