const { NewsletterSubscription, UserAlertPreference, UserAlertItemPreference, Alert, AlertTrigger } = require('~models');
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

const saveItemsPreferences = async (userId, items, alertId) => {
    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    if (!alertId) {
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

    const alert = await Alert.findByPk(alertId);

    if (!alert) {
        throw new BadRequestError("Alert not found");
    }

    await UserAlertItemPreference.destroy({
        where: {
            userId,
            alertId,
        },
    });

    const itemsPreferences = items.map((itemId) => ({
        userId,
        alertId,
        itemId,
    }));

    return await UserAlertItemPreference.bulkCreate(itemsPreferences);
}

const addAlertTrigger = async (alertId, itemIds) => {
    if (!alertId) {
        throw new Error("Alert ID is required");
    }

    if (!Array.isArray(itemIds)) {
        itemIds = [itemIds];
    }

    if (!itemIds || itemIds.length === 0) {
        throw new Error("Item IDs are required");
    }

    const alert = await Alert.findByPk(alertId);

    if (!alert) {
        throw new Error("Alert not found");
    }

    const alertTriggers = itemIds.map((itemId) => ({
        alertId,
        itemId,
    }));

    return await AlertTrigger.bulkCreate(alertTriggers);
}

const addProductAddedWithCategoriesAlertTrigger = async (productId) => {
    const categoryIds = await productService.getCategoryIdsByProduct(productId);

    if (!categoryIds || categoryIds.length === 0) {
        throw new Error("Product has no categories");
    }

    return await addAlertTrigger(NEW_PRODUCT, categoryIds);
}

module.exports = {
    subscribe,
    savePreferences,
    saveItemsPreferences,
    addAlertTrigger,
    addProductAddedWithCategoriesAlertTrigger,
};