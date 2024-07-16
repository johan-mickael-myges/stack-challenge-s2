const { validationResult } = require('express-validator');
const userService = require('~services/userService');
const { env } = require("~config/config");

exports.check = (req, res, next) => {
    res.sendStatus(200);
}

exports.registerUser = async (req, res, next) => {
    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json(newUser);
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