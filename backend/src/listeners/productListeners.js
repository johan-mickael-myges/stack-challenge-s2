const eventEmitter = require('~services/eventEmitter');
const productFactory = require('../factories/productDenormalizedFactory');
const MongooseProduct = require('../models/mongoose/Product'); 

eventEmitter.on('productCreated', async (product) => {
    try {
        const productData = await productFactory(product);
        const mongooseProduct = new MongooseProduct(productData);
        await mongooseProduct.save();
        console.info('Product saved successfully in MongoDB', mongooseProduct);
        eventEmitter.emit('alert:productAdded', mongooseProduct);
    } catch (error) {
        console.error('Error transforming and saving product', {
            error,
            product
        });
    }
});

eventEmitter.on('productUpdated', async (data) => {
    const {productId, product} = data;

    try {
        const productData = await productFactory(product);

        const updatedProduct = await MongooseProduct.findOneAndUpdate(
                {originalId: productId},
                productData,
                {new: true, useFindAndModify: false}
        );

        if (!updatedProduct) {
            console.error('Product not found in MongoDB', product);
            return;
        }

        console.info('Product updated successfully in MongoDB', updatedProduct._id);
    } catch (error) {
        console.error('Error transforming and saving product', {
            error,
            product
        });
    }
});

eventEmitter.on('productDeleted', async (productId) => {
    try {
        const deletedProduct = await MongooseProduct.findOneAndDelete(
                {originalId: productId}
        );

        if (!deletedProduct) {
            console.error('Product not found in MongoDB', productId);
            return;
        }

        console.info('Product deleted successfully in MongoDB', deletedProduct);
    } catch (error) {
        console.error('Error deleting product', {
            error,
            productId
        });
    }
});

module.exports = eventEmitter;