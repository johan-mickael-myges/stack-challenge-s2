const express = require('express');
const authController = require('~controllers/authController');
const validateRegistration = require('~middlewares/validate');

const router = express.Router();

router.post('/register', validateRegistration, authController.registerUser);

module.exports = router;