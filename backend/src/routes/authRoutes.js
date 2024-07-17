const express = require('express');
const authController = require('~controllers/authController');
const validateRegistration = require('~middlewares/validations/validateRegistration');
const { checkToken } = require("~middlewares/authMiddleware");

const router = express.Router();

router.get('/check', checkToken, authController.check);
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;