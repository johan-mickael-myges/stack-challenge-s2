const newsletterService = require('~services/newsletterService');

const subscribe = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const { subscribed } = req.body;

        const response = await newsletterService.subscribe(userId, subscribed);

        if (response.type === "create") {
            return res.status(201).json(response.data);
        }

        return res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
}

const savePreferences = async (req, res, next) => {
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

const saveItemsPreferences = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const { items, userAlertPreferenceId } = req.body;

        const response = await newsletterService.saveItemsPreferences(userId, items, userAlertPreferenceId);

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    subscribe,
    savePreferences,
    saveItemsPreferences,
};