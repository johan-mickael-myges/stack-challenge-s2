const eventEmitter = require('~services/eventEmitter');
const productFactory = require('../factories/productDenormalizedFactory');
const MongooseProduct = require('../models/mongoose/Product'); // Mongoose models

eventEmitter.on('productCreated', async (product) => {
    try {
        const productData = await productFactory(product);
        const mongooseProduct = new MongooseProduct(productData);
        await mongooseProduct.save();
        console.info('Product saved successfully in MongoDB', mongooseProduct);
    } catch (error) {
        console.error('Error transforming and saving product', {
            error,
            product
        });
    }
});

eventEmitter.on('productUpdated', async (data) => {
    const { productId, product } = data;

    try {
        const productData = await productFactory(product);

        const updatedProduct = await MongooseProduct.findOneAndUpdate(
                { originalId: productId },
                productData,
                { new: true, useFindAndModify: false }
        );

        if (!updatedProduct) {
            console.error('Product not found in MongoDB', product);
            return;
        }

        console.info('Product updated successfully in MongoDB', updatedProduct);
    } catch (error) {
        console.error('Error transforming and saving product', {
            error,
            product
        });
    }
});

module.exports = eventEmitter;