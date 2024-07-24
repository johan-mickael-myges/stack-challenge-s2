const {
    NewsletterSubscription,
    UserAlertPreference,
    UserAlertItemPreference,
    Alert,
    AlertTrigger,
    User
} = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const {getBoolValue} = require('~utils/queryOptionsFactory');
const {NEW_PRODUCT, RESTOCK, PRICE_CHANGE} = require("../constants/alerts");
const sendMail = require('~services/mailerService');
const productService = require("~services/productService");
const userService = require("~services/userService");
const eventEmitter = require('~services/eventEmitter');

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
        const response = {
            data: await NewsletterSubscription.create({
                userId,
                subscribed,
            }),
            type: "create",
        };

        if (subscribed) {
            eventEmitter.emit("alert:newsletter:subscribed", userId);
        } else {
            eventEmitter.emit("alert:newsletter:unsubscribed", userId);
        }

        return response;
    } else {
        const response = {
            data: await currentSubscription.update({
                subscribed,
            }),
            type: "update",
        };

        if (subscribed) {
            eventEmitter.emit("alert:newsletter:subscribed", userId);
        } else {
            eventEmitter.emit("alert:newsletter:unsubscribed", userId);
        }

        return response;
    }
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

const sendAlertToUsers = async (users, subject, templateName, data) => {
    if (!users || users.length === 0) {
        return [];
    }

    let recipients = [];

    users.forEach((user) => {
        recipients.push(user.email);
    });

    await sendMail(recipients, subject, templateName, data);

    return recipients;
}

const sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert = async (product) => {
    const categoryIds = await productService.getCategoryIdsByProduct(product.originalId);

    const users = await userService.getUsersThatShouldReceiveAlertForSubscribedItems(categoryIds, NEW_PRODUCT);

    return await sendAlertToUsers(
            users,
            "Des produits ont été ajoutés dans une catégorie que vous suive",
            "new-product-added-on-category",
            {
                product,
                productUrl: productService.generateProductURL(product.originalId),
            }
    );
}

const sendEmailToUsersWhenProductHasBeenAddedOnStock = async (productId) => {
    const product = await productService.getProductById(productId, {
        denormalize: true,
    });

    if (!product) {
        return [];
    }

    const users = await userService.getUsersThatShouldReceiveAlertForSubscribedItems([productId], RESTOCK);

    return await sendAlertToUsers(
            users,
            "Un produit est de nouveau en stock",
            "product-added-on-stock",
            {
                product,
                productUrl: productService.generateProductURL(product.originalId),
            }
    );
}

const sendEmailToUsersThatShouldReceivedProductPriceChangesAlert = async (productId, oldPrice) => {
    const product = await productService.getProductById(productId);

    if (!product) {
        return [];
    }

    const users = await userService.getUsersThatShouldReceiveAlertForSubscribedItems([productId], PRICE_CHANGE);

    return await sendAlertToUsers(
        users,
        "Le prix d'un produit que vous suivez a changé",
        "product-price-changed",
        {
            product,
            oldPrice,
            productUrl: productService.generateProductURL(productId),
        }
    );
}

const sendEmailForUserForNewsletterSubscription = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        return [];
    }

    return await sendAlertToUsers(
        [user],
        "LAYALIN - Inscription à la newsletter",
        "newsletter-subscription",
        {
            user,
        }
    );
}

const sendEmailForUserForNewsletterUnsubscription = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        return [];
    }

    return await sendAlertToUsers(
        [user],
        "LAYALIN - Désinscription à la newsletter",
        "newsletter-unsubscription",
        {
            user,
        }
    );
}

module.exports = {
    subscribe,
    savePreferences,
    saveItemsPreferences,
    sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert,
    sendEmailToUsersWhenProductHasBeenAddedOnStock,
    sendEmailToUsersThatShouldReceivedProductPriceChangesAlert,
    sendEmailForUserForNewsletterSubscription,
    sendEmailForUserForNewsletterUnsubscription,
};