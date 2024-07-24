const { validationResult } = require('express-validator');
const userService = require('~services/userService');
const { env } = require("~config/config");
const { User } = require('~models');

exports.check = (req, res, next) => {
    res.status(200).json(req.user);
}

exports.getInfoUser = async (req, res, next) => {
  try {
      const userId = req.user.userId;
      const user = await userService.getInfoUser(userId);
      res.status(200).json(user);
  } catch (error) {
      next(error);
  }
};


exports.registerUser = async (req, res, next) => {
    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    const {userId} = req.user;
    const { password } = req.body;

    try {
        const user = await userService.deleteUser(userId, password);
        res.status(204).json(user);
    } catch (error) {
       next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    const { userId } = req.user;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
    try {
      const user = await userService.changePassword(userId, currentPassword, newPassword, confirmNewPassword);
      res.status(200).json(user);
    } catch (error) {
       next(error);
    }
};


exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.sendStatus(400);
    }

    const { email, password } = req.body;

    try {
        const { user, token } = await userService.loginUser(email, password);
        res.cookie('token', token, {
            httpOnly: true ,
            secure: env === 'production',
            maxAge: 60 * 60 * 1000,
        });
        res.status(200).json({ user, token });
    } catch (error) {
        next(error);
    }
};

exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    res.sendStatus(200);
}

exports.sendEmailResetPassword = async (req, res, next) => {
  try {
      const { email } = req.body;
      await userService.sendEmailResetPassword(email);
      res.sendStatus(200);
  } catch (error) {
      next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

exports.validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    await userService.validateResetToken(token);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
};

exports.getCookiePreference = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId, {
        attributes: ['cookiesAccepted']
      });
      if (user) {
        res.status(200).json({ cookiesAccepted: user.cookiesAccepted });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error fetching cookie preference:', error);
      next(error);
    }
};

exports.updateCookiePreference = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { cookiesAccepted } = req.body;
    
      const user = await User.findByPk(userId);
      if (user) {
        user.cookiesAccepted = cookiesAccepted;
        await user.save();
        res.status(200).json({ message: 'Cookie preference updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error updating cookie preference:', error);
      next(error);
    }
  };