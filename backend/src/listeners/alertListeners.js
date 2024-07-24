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

module.exports = eventEmitter;