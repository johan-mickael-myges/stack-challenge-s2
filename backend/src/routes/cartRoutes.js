const express = require('express');
const cartController = require('~controllers/cartController');
const router = express.Router();


router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCartItems);

// router.post('/add', (req, res, next) => {
//     console.log('Route /cart/add hit');
//     next();
// }, cartController.addToCart);

module.exports = router;