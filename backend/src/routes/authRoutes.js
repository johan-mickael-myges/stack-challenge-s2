const express = require('express');
const authController = require('~controllers/authController');
const validateRegistration = require('~middlewares/validateRegistration');

const router = express.Router();

router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;