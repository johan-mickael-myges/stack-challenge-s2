const { Product } = require('~models');
const { uploadToS3, generateFileDestination } = require('~services/s3Service');

const createProduct = async (productData, files) => {
    let thumbnailFile, imagesFiles, thumbnailDestination, imagesDestinations;

    if (files) {
        thumbnailFile = files['thumbnail'] ? files['thumbnail'][0] : null;
        imagesFiles = files['images'] ? files['images'] : [];

        thumbnailDestination = thumbnailFile ? await generateFileDestination(thumbnailFile, 'products') : null;
        imagesDestinations = imagesFiles.length ? await Promise.all(imagesFiles.map(async (image) => {
            return await generateFileDestination(image, 'products');
        })) : [];

        if (thumbnailDestination) {
            productData.thumbnail = thumbnailDestination.url;
        }

        if (imagesDestinations) {
            productData.images = imagesDestinations.map(image => image.url);
        }
    }

    const product = await Product.create(productData);

    if (files) {
        if (thumbnailDestination) {
            await uploadToS3(thumbnailFile, thumbnailDestination);
        }

        if (imagesDestinations) {
            await Promise.all(imagesFiles.map(async (image, index) => {
                await uploadToS3(image, imagesDestinations[index]);
            }));
        }
    }

    return product;
};

const updateProduct = async (productId, productData, files) => {
    let thumbnailFile, imagesFiles, thumbnailDestination, imagesDestinations;

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    if (files) {
        thumbnailFile = files['thumbnail'] ? files['thumbnail'][0] : null;
        imagesFiles = files['images'] ? files['images'] : [];

        thumbnailDestination = thumbnailFile ? await generateFileDestination(thumbnailFile, 'products') : null;
        imagesDestinations = imagesFiles.length ? await Promise.all(imagesFiles.map(async (image) => {
            return await generateFileDestination(image, 'products');
        })) : [];
    }

    productData.thumbnail = thumbnailDestination ? thumbnailDestination.url : product.thumbnail;
    productData.images = imagesDestinations ? imagesDestinations.map(image => image.url) : product.images;

    await product.update(productData);

    if (thumbnailFile) {
        await uploadToS3(thumbnailFile, thumbnailDestination);
    }

    if (imagesFiles) {
        await Promise.all(imagesFiles.map(async (image, index) => {
            await uploadToS3(image, imagesDestinations[index]);
        }));
    }

    return product;
};

const deleteProduct = async (productId) => {
    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    await product.destroy();
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
};
