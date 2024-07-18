const express = require('express');
const router = express.Router();
const { getUserProfile, getUserOrders } = require('../controllers/userController');

router.get('/profile', getUserProfile);
router.get('/orders', getUserOrders);

module.exports = router;
