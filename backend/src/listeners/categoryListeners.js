const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('categoryUpdated', async (newCategory, oldCategory) => {
    try {
        const result = await MongooseProduct.updateMany(
            { categories: oldCategory },
            { $set: { "categories.$": newCategory } }
        );
         console.log(`Successfully updated ${result.modifiedCount} products from category ${oldCategory} to ${newCategory}`);
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
        console.log(`Successfully deleted category ${category} from ${result.modifiedCount} products`);
    } catch (error) {
        console.error('Error deleting category from products:', error);
    }
});

module.exports = eventEmitter;