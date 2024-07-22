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

router.patch('/:userId/cookies', async (req, res) => { 
    const { userId } = req.params;
    const { cookiesAccepted } = req.body;

    try {
        console.log(`Updating cookies for user: ${userId} with value: ${cookiesAccepted}`);
        const user = await User.findByPk(userId);
        if (user) {
            user.cookiesAccepted = cookiesAccepted;
            await user.save();
            res.status(200).json({ message: 'Cookie preference updated successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error updating cookie preference:', error);
        res.status(500).json({ message: 'Error updating cookie preference.', error });
    }
});

module.exports = router;
