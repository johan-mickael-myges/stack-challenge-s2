const { validationResult } = require('express-validator');
const userService = require('~services/userService');
const { env } = require("~config/config");

exports.check = (req, res, next) => {
    res.status(200).json(req.user);
}

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