const eventEmitter = require('~services/eventEmitter');
const productFactory = require('../factories/productDenormalizedFactory');
const MongooseProduct = require('../models/mongoose/Product'); 

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

        console.info('Product updated successfully in MongoDB', updatedProduct);
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