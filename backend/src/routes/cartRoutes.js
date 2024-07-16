const express = require('express');
const cartController = require('~controllers/cartController');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');


router.post('/', authorizeRoles(['ROLE_ADMIN', 'ROLE_USER'], false), cartController.addToCart);
router.get('/', authorizeRoles(['ROLE_ADMIN', 'ROLE_USER'], false), cartController.getCartItems);
router.delete('/:productId', authorizeRoles(['ROLE_ADMIN', 'ROLE_USER'], false), cartController.removeFromCart);

module.exports = router;