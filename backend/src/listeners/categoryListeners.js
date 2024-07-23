const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('categoryUpdated', async (newCategory, oldCategory) => {
    try {
        const result = await MongooseProduct.updateMany(
            { categories: oldCategory },
            { $set: { "categories.$": newCategory } }
        );
    }catch (error) {
        console.error('Error updating products:', error);
    }
});

eventEmitter.on('categoryDeleted', async (category) => {
    try {
        const result = await MongooseProduct.updateMany(
            { categories: category },
            { $pull: { categories: category } }
        );
    } catch (error) {
        console.error('Error deleting category from products:', error);
    }
});

module.exports = eventEmitter;