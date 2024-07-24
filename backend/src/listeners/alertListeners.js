const eventEmitter = require('~services/eventEmitter');
const newsletterService = require('~services/newsletterService');
const productService = require('~services/productService');

eventEmitter.on('alert:productAdded', async (product) => {
    try {
        const recipients = await newsletterService.sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert(product);
        console.info('Emails sent to :', recipients);
    } catch (error) {
        console.error('Error triggering alert:productAdded', error);
    }
});

eventEmitter.on('alert:restock', async (productId) => {
    try {
        const recipients = await newsletterService.sendEmailToUsersWhenProductHasBeenAddedOnStock(productId);
        console.info('Emails sent to :', recipients);
    } catch (error) {
        console.error('Error triggering alert:productUpdated', error);
    }
});

eventEmitter.on('alert:productPriceChanged', async (data) => {
    try {
        console.log('data', data);
        const recipients = await newsletterService.sendEmailToUsersThatShouldReceivedProductPriceChangesAlert(data.productId, data.oldPrice);
        console.info('Emails sent to :', recipients);
    } catch (error) {
        console.error('Error triggering alert:productPriceChanged', error);
    }
});

eventEmitter.on('alert:newsletter:subscribed', async (userId) => {
    try {
        await newsletterService.sendEmailForUserForNewsletterSubscription(userId);
    } catch (error) {
        console.error('Error triggering alert:newsletter:subscribed', error);
    }
});

eventEmitter.on('alert:newsletter:unsubscribed', async (userId) => {
    try {
        await newsletterService.sendEmailForUserForNewsletterUnsubscription(userId);
    } catch (error) {
        console.error('Error triggering alert:newsletter:unsubscribed', error);
    }
});

module.exports = eventEmitter;