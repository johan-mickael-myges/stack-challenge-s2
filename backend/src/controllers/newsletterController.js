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

module.exports = {
    subscribe,
};