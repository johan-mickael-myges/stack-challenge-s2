const express = require('express');
const cartController = require('~controllers/cartController');
const router = express.Router();
const checkRoles = require('~middlewares/authMiddleware');


router.post('/', checkRoles([], false), cartController.addToCart);
router.get('/', checkRoles([], false), cartController.getCartItems);
router.delete('/:productId', checkRoles([], false), cartController.removeFromCart);

module.exports = router;