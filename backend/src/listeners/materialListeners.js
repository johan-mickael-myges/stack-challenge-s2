const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('materialUpdated', async (newMaterial, oldMaterial) => {
    try {
        const result = await MongooseProduct.updateMany(
            { materials: oldMaterial },
            { $set: { "materials.$": newMaterial} }
        );
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
    } catch (error) {
        console.error('Error deleting material from products:', error);
    }
});

module.exports = eventEmitter;