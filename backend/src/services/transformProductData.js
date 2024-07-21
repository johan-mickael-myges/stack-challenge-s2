const MongooseProduct = require('../models/mongoose/Product'); // Mongoose models
const productFactory = require('../factories/productDenormalizedFactory');

const transformAndSaveProduct = async (sequelizeProduct) => {
    const productData = await productFactory(sequelizeProduct);
    const mongooseProduct = new MongooseProduct(productData);

    await mongooseProduct.save();
};

module.exports = transformAndSaveProduct;
