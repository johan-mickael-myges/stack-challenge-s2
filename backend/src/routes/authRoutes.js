const express = require('express');
const authController = require('~controllers/authController');
const validateRegistration = require('~middlewares/validations/validateRegistration');
const { checkToken } = require('~middlewares/authMiddleware');
const { User } = require('../models');

const router = express.Router();

router.get('/check', checkToken, authController.check);
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/delete', checkToken, authController.deleteUser);
router.post('/change-password', checkToken, authController.changePassword);

router.get('/cookies', checkToken, authController.getCookiePreference);
router.patch('/cookies', checkToken, authController.updateCookiePreference);




module.exports = router;
