const userService = require('~services/userService');
const newsletterService = require('~services/newsletterService');

exports.getAlerts = async (req, res, next) => {
    try {
        const alerts = await userService.getAlerts(req.user.userId);
        res.status(200).json(alerts);
    } catch (error) {
        next(error);
    }
}

exports.getAlertSubscriptionForUser = async (req, res, next) => {
    try {
        const subscription = await newsletterService.getAlertSubscriptionForUser(req.user.userId);
        res.status(200).json(subscription);
    } catch (error) {
        next(error);
    }
}

exports.getAlertPreferencesForUser = async (req, res, next) => {
    try {
        const preferences = await newsletterService.getAlertPreferencesForUser(req.user.userId);
        res.status(200).json(preferences);
    } catch (error) {
        next(error);
    }
}

exports.getAlertPreferenceForUser = async (req, res, next) => {
    try {
        const { alertId } = req.params;
        const preference = await newsletterService.getAlertPreferenceForUser(req.user.userId, alertId);
        res.status(200).json(preference);
    } catch (error) {
        next(error);
    }
}

exports.savePreferences = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const { alertId, enabled } = req.body;

        const response = await newsletterService.savePreferences(userId, alertId, enabled);

        if (response.type === "create") {
            return res.status(201).json(response.data);
        }

        return res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
}

exports.saveItemsPreferences = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const { items, userAlertPreferenceId } = req.body;

        const response = await newsletterService.saveItemsPreferences(userId, items, userAlertPreferenceId);

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}