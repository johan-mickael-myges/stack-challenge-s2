const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('colorUpdated', async (newColor, oldColor) => {
    try {
        const result = await MongooseProduct.updateMany(
            { colors: oldColor },
            { $set: { "colors.$": newColor } }
        );
         console.log(`Successfully updated ${result.modifiedCount} products from color ${oldColor} to ${newColor}`);
    }catch (error) {
        console.error('Error updating products:', error);
    }
});

eventEmitter.on('colorDeleted', async (color) => {
    try {
        const result = await MongooseProduct.updateMany(
            { colors: color },
            { $pull: { colors: color } }
        );
        console.log(`Successfully deleted color ${color} from ${result.modifiedCount} products`);
    } catch (error) {
        console.error('Error deleting color from products:', error);
    }
});

module.exports = eventEmitter;
