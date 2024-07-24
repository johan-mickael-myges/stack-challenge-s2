const { NewsletterSubscription, UserAlertPreference, UserAlertItemPreference, Alert, AlertTrigger, User } = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const {getBoolValue} = require('~utils/queryOptionsFactory');
const productService = require('~services/productService');
const {NEW_PRODUCT} = require("../constants/alerts");

const subscribe = async (userId, subscribed) => {
    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    subscribed = getBoolValue(subscribed);

    const currentSubscription = await NewsletterSubscription.findOne({
        where: {
            userId,
        },
    });

    if (!currentSubscription) {
        return {
            data: await NewsletterSubscription.create({
                userId,
                subscribed,
            }),
            type: "create",
        };
    }

    return {
        data: await currentSubscription.update({
            subscribed,
        }),
        type: "update",
    };
}

const savePreferences = async (userId, alertId, enabled) => {
    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    if (!alertId) {
        throw new BadRequestError("Alert ID is required");
    }

    const alert = await Alert.findByPk(alertId);

    if (!alert) {
        throw new BadRequestError("Alert not found");
    }

    enabled = getBoolValue(enabled);

    const currentAlertPreference = await UserAlertPreference.findOne({
        where: {
            userId,
            alertId,
        },
    });

    if (!currentAlertPreference) {
        return {
            data: await UserAlertPreference.create({
                userId,
                alertId,
                enabled,
            }),
            type: "create",
        };
    }

    return {
        data: await currentAlertPreference.update({
            enabled,
        }),
        type: "update",
    };
}

const saveItemsPreferences = async (userId, items, userAlertPreferenceId) => {
    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    if (!userAlertPreferenceId) {
        throw new BadRequestError("Alert ID is required");
    }

    if (!Array.isArray(items)) {
        try {
            items = items.split(",").map((item) => parseInt(item));
        } catch (error) {
            throw new BadRequestError("Items must be an array of integers");
        }
    }

    if (!items || items.length === 0) {
        throw new BadRequestError("Items are required");
    }

    const alertPreference = await UserAlertPreference.findByPk(userAlertPreferenceId);

    if (!alertPreference) {
        throw new BadRequestError("Alert preference not found");
    }

    await UserAlertItemPreference.destroy({
        where: {
            userAlertPreferenceId,
        },
    });

    const itemsPreferences = items.map((itemId) => ({
        userId,
        userAlertPreferenceId,
        itemId,
    }));

    return await UserAlertItemPreference.bulkCreate(itemsPreferences);
}

const addProductAddedWithCategoriesAlertTrigger = async (productId) => {
    const categoryIds = await productService.getCategoryIdsByProduct(productId);

    if (!categoryIds || categoryIds.length === 0) {
        throw new Error("Product has no categories");
    }

    return await addAlertTrigger(NEW_PRODUCT, categoryIds);
}

const getUsersThatShouldReceivedNewProductAddedOnCategoryAlert = async () => {
    return await User.findAll({
        attributes:{
            exclude: ['createdAt', 'updatedAt', 'number']
        },
        include: [
            {
                model: UserAlertPreference,
                as: 'alertPreferences',
                attributes: [],
                where: {
                    alertId: 1, // Example alertId
                    enabled: true,
                },
                required: true,
                include: [
                    {
                        model: UserAlertItemPreference,
                        as: 'alertItemPreferences',
                        attributes: [],
                        required: true,
                    },
                ],
            },
            {
                model: NewsletterSubscription,
                as: 'newsletterSubscription',
                attributes: [],
                where: {
                    subscribed: true,
                },
                required: true,
            },
        ],
    });
};

module.exports = {
    subscribe,
    savePreferences,
    saveItemsPreferences,
    addProductAddedWithCategoriesAlertTrigger,
    getUsersThatShouldReceivedNewProductAddedOnCategoryAlert,
};