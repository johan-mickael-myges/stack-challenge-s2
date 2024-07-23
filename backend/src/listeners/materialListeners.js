const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('materialUpdated', async (newMaterial, oldMaterial) => {
    try {
        const result = await MongooseProduct.updateMany(
            { materials: oldMaterial },
            { $set: { "materials.$": newMaterial} }
        );
         console.log(`Successfully updated ${result.modifiedCount} products from material ${oldMaterial} to ${newMaterial}`);
    }catch (error) {
        console.error('Error updating products:', error);
    }
});

eventEmitter.on('materialDeleted', async (material) => {
    try {
        const result = await MongooseProduct.updateMany(
            { materials: material },
            { $pull: { materials: material } }
        );
        console.log(`Successfully deleted material ${material} from ${result.modifiedCount} products`);
    } catch (error) {
        console.error('Error deleting material from products:', error);
    }
});

module.exports = eventEmitter;