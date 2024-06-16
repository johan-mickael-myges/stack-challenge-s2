const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

module.exports = router;