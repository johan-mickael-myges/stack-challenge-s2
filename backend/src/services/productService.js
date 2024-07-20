const { Product, Color, Brand, Category, Material } = require('~models');
const { uploadToS3, generateFileDestination } = require('~services/s3Service');
const NotFoundError = require('~errors/NotFoundError');
const BadRequestError = require('~errors/BadRequestError');

const countProducts = async () => {
    return Product.count();
}

const getAllProducts = async (options) => {
    return Product.findAll(options);
}

const getProductById = async (productId) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    const options = {
        include: [
            {
                association: 'categories',
                attributes: ['id', 'name'],
                through: { attributes: [] },
            },
            {
                association: 'colors',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            },
            {
                association: 'materials',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            },
            {
                association: 'brand',
                attributes: ['id', 'name']
            }
        ],
    }

    const product = await Product.findByPk(productId, options);

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    return product;
}

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

    const { categories, colors, materials, brand, ...productDetails } = productData;

    const product = await Product.create(productDetails);

    const categoriesValues = categories ? categories.split(',').map(category => Number(category)) : [];
    if (categories) {
        const categoriesInstances = await Category.findAll({ where: { id: categoriesValues } });
        await product.setCategories(categoriesInstances);
    }

    const colorsValues = colors ? colors.split(',').map(color => Number(color)) : [];
    if (colors) {
        const colorsInstances = await Color.findAll({ where: { id: colorsValues } });
        await product.setColors(colorsInstances);
    }

    const materialsValues = materials ? materials.split(',').map(material => Number(material)) : [];
    if (materials) {
        const materialsInstances = await Material.findAll({ where: { id: materialsValues } });
        await product.setMaterials(materialsInstances);
    }

    if (brand) {
        const brandInstance = await Brand.findByPk(brand);
        await product.setBrand(brandInstance);
    }

    await product.save();

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

    const { categories, colors, materials, brand, ...productDetails } = productData;

    productDetails.thumbnail = thumbnailDestination ? thumbnailDestination.url : product.thumbnail;
    productDetails.images = imagesDestinations ? imagesDestinations.map(image => image.url) : product.images;

    await product.update(productDetails);

    const categoriesValues = categories ? categories.split(',').map(category => Number(category)) : [];
    if (categories) {
        const categoriesInstances = await Category.findAll({ where: { id: categoriesValues } });
        await product.setCategories(categoriesInstances);
    }

    const colorsValues = colors ? colors.split(',').map(color => Number(color)) : [];
    if (colors) {
        const colorsInstances = await Color.findAll({ where: { id: colorsValues } });
        await product.setColors(colorsInstances);
    }

    const materialsValues = materials ? materials.split(',').map(material => Number(material)) : [];
    if (materials) {
        const materialsInstances = await Material.findAll({ where: { id: materialsValues } });
        await product.setMaterials(materialsInstances);
    }

    if (brand) {
        const brandInstance = await Brand.findByPk(brand);
        await product.setBrand(brandInstance);
    }

    if (files) {
        if (thumbnailFile) {
            await uploadToS3(thumbnailFile, thumbnailDestination);
        }

        if (imagesFiles) {
            await Promise.all(imagesFiles.map(async (image, index) => {
                await uploadToS3(image, imagesDestinations[index]);
            }));
        }
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
    countProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
