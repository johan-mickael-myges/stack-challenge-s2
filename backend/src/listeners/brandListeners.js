const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('brandUpdated', async (newBrand, oldBrand) => {
    try {
        const result = await MongooseProduct.updateMany(
                { brand: oldBrand },
                { $set: { brand: newBrand } }
        );
        console.log(`Successfully updated ${result.modifiedCount} products from brand ${oldBrand} to ${newBrand}`);
    }catch (error) {
        console.error('Error updating products:', error);
    }
});

eventEmitter.on('brandDeleted', async (brand) => {
    try {
        const result = await MongooseProduct.updateMany(
                { brand: brand },
                { $unset: { brand: null } }
        );
        console.log(`Successfully deleted brand ${brand} from ${result.modifiedCount} products`);
    } catch (error) {
        console.error('Error deleting brand from products:', error);
    }
});

module.exports = eventEmitter;