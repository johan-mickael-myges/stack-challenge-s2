const eventEmitter = require('~services/eventEmitter');
const newsletterService = require('~services/newsletterService');

eventEmitter.on('alert:productAdded', async (product) => {
    try {
        const recipients = await newsletterService.sendEmailToUsersThatShouldReceivedNewProductAddedOnCategoryAlert(product);
        console.info('Emails sent to :', recipients);
    } catch (error) {
        console.error('Error triggering alert:productAdded', error);
    }
});

module.exports = eventEmitter;