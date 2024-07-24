const eventEmitter = require('~services/eventEmitter');
const newsletterService = require('~services/newsletterService');

eventEmitter.on('alert:productAdded', async (product) => {
    try {
        await newsletterService.addProductAddedWithCategoriesAlertTrigger(product.dataValues.id);
    } catch (error) {
        console.error('Error triggering alert:productAdded', error);
    }
});

module.exports = eventEmitter;