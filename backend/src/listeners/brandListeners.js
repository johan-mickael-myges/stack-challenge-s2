const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('../models/mongoose/Product');

eventEmitter.on('brandUpdated', async (newBrand, oldBrand) => {
    try {
        const result = await MongooseProduct.updateMany(
                { brand: oldBrand },
                { $set: { brand: newBrand } }
        );
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
    } catch (error) {
        console.error('Error deleting brand from products:', error);
    }
});

module.exports = eventEmitter;