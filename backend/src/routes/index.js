const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const adminRoutes = require('./admin');
const registerRoutes = require('./authentification')

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/register', registerRoutes)

module.exports = router;