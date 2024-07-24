const { NewsletterSubscription, UserAlertPreference, UserAlertItemPreference, Alert, AlertTrigger, User } = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const {getBoolValue} = require('~utils/queryOptionsFactory');
const {NEW_PRODUCT} = require("../constants/alerts");
const sendMail = require('~services/mailerService');
const productService = require("~services/productService");

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

const getUsersThatShouldReceivedNewProductAddedOnCategoryAlert = async (categoryIds) => {
    if (!categoryIds) {
        throw new Error("Category ID is required");
    }

    let itemIds = categoryIds;

    if (!Array.isArray(categoryIds)) {
        itemIds = [categoryIds];
    }

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
                    alertId: NEW_PRODUCT,
                    enabled: true,
                },
                required: true,
                include: [
                    {
                        model: UserAlertItemPreference,
                        as: 'alertItemPreferences',
                        attributes: [],
                        where: {
                            itemId: itemIds,
                        },
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

const sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert = async (product) => {
    const categoryIds = await productService.getCategoryIdsByProduct(product.originalId);

    if (!categoryIds) {
        return [];
    }

    const users = await getUsersThatShouldReceivedNewProductAddedOnCategoryAlert(categoryIds);

    if (!users || users.length === 0) {
        return [];
    }

    let recipients = [];

    users.forEach((user) => {
        recipients.push(user.email);
    });

    const subject = "Des produits ont été ajoutés dans une catégorie que vous suivez";
    const templateName = "new-product-added-on-category";
    const data = {
        product,
        productUrl: productService.generateProductURL(product.originalId),
    };

    await sendMail(recipients, subject, templateName, data);

    return recipients;
}

module.exports = {
    subscribe,
    savePreferences,
    saveItemsPreferences,
    getUsersThatShouldReceivedNewProductAddedOnCategoryAlert,
    sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert,
};