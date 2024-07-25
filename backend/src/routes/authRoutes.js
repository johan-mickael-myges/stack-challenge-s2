const express = require('express');
const authController = require('~controllers/authController');
const validateRegistration = require('~middlewares/validations/validateRegistration');
const { checkToken } = require('~middlewares/authMiddleware');
const {authorizeRoles} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/check', checkToken, authController.check);
router.get('/check-admin', checkToken, authorizeRoles(['ROLE_ADMIN']), authController.checkAdmin);
router.get('/current', checkToken, authController.getInfoUser);
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/delete', checkToken, authController.deleteUser);
router.post('/change-password', checkToken, authController.changePassword);
router.post('/EmailResetPassword', authController.sendEmailResetPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/validateResetToken', authController.validateResetToken);
router.get('/cookies', checkToken, authController.getCookiePreference);
router.patch('/cookies', checkToken, authController.updateCookiePreference);

module.exports = router;
