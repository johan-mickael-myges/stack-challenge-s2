const {Product, Color, Brand, Category, Material} = require('~models');
const {uploadToS3, generateFileDestination} = require('~services/s3Service');
const NotFoundError = require('~errors/NotFoundError');
const BadRequestError = require('~errors/BadRequestError');
const eventEmitter = require('~services/eventEmitter');
const MongooseProduct = require('~models/mongoose/Product');
const {buildMongooseQuery, getBoolValue} = require('~utils/queryOptionsFactory');
const generateProductFacets = require('~utils/facetBuilderFactory');
const config = require('~config/config');

const countProducts = async (options = {}) => {
    if (getBoolValue(options['denormalize'])) {
        return MongooseProduct.countDocuments();
    }

    return Product.count();
}

const countMatchingProducts = async (options = {}) => {
    if (getBoolValue(options['denormalize'])) {
        const builtQuery = buildMongooseQuery(MongooseProduct.find(), options);
        return builtQuery.countDocuments();
    }

    return Product.count(options);
}

const getAllProducts = async (options = {}) => {
    if (getBoolValue(options['denormalize'])) {
        const builtQuery = buildMongooseQuery(MongooseProduct.find(), options);
        return builtQuery.exec();
    }

    return Product.findAll(options);
}

const getProductById = async (productId, options = {}) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    let product;

    if (getBoolValue(options['denormalize'])) {
        product = MongooseProduct.findOne({originalId: productId});
    } else {
        const sequelizeOptions = {
            include: [
                {
                    association: 'categories',
                    attributes: ['id', 'name'],
                    through: {attributes: []},
                },
                {
                    association: 'colors',
                    attributes: ['id', 'name'],
                    through: {attributes: []}
                },
                {
                    association: 'materials',
                    attributes: ['id', 'name'],
                    through: {attributes: []}
                },
                {
                    association: 'brand',
                    attributes: ['id', 'name']
                }
            ],
        };

        options = {...options, ...sequelizeOptions};

        product = await Product.findByPk(productId, options);
    }

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

    const {categories, colors, materials, brand, ...productDetails} = productData;

    const product = await Product.create(productDetails);

    const categoriesValues = categories ? categories.split(',').map(category => Number(category)) : [];
    if (categories) {
        const categoriesInstances = await Category.findAll({where: {id: categoriesValues}});
        await product.setCategories(categoriesInstances);
    }

    const colorsValues = colors ? colors.split(',').map(color => Number(color)) : [];
    if (colors) {
        const colorsInstances = await Color.findAll({where: {id: colorsValues}});
        await product.setColors(colorsInstances);
    }

    const materialsValues = materials ? materials.split(',').map(material => Number(material)) : [];
    if (materials) {
        const materialsInstances = await Material.findAll({where: {id: materialsValues}});
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

    eventEmitter.emit('productCreated', product);

    return product;
};

const updateProduct = async (productId, productData, files) => {
    let thumbnailFile, imagesFiles, thumbnailDestination, imagesDestinations;

    const product = await Product.findByPk(productId);

    if (!product) {
        throw new Error('Product not found');
    }

    const oldPrice = product.price;

    if (files) {
        thumbnailFile = files['thumbnail'] ? files['thumbnail'][0] : null;
        imagesFiles = files['images'] ? files['images'] : [];

        thumbnailDestination = thumbnailFile ? await generateFileDestination(thumbnailFile, 'products') : null;
        imagesDestinations = imagesFiles.length ? await Promise.all(imagesFiles.map(async (image) => {
            return await generateFileDestination(image, 'products');
        })) : [];
    }

    const {categories, colors, materials, brand, ...productDetails} = productData;

    productDetails.thumbnail = thumbnailDestination ? thumbnailDestination.url : product.thumbnail;
    productDetails.images = imagesDestinations ? imagesDestinations.map(image => image.url) : product.images;

    const updatedProduct = await product.update(productDetails);

    const categoriesValues = categories ? categories.split(',').map(category => Number(category)) : [];
    if (categories) {
        const categoriesInstances = await Category.findAll({where: {id: categoriesValues}});
        await product.setCategories(categoriesInstances);
    }

    const colorsValues = colors ? colors.split(',').map(color => Number(color)) : [];
    if (colors) {
        const colorsInstances = await Color.findAll({where: {id: colorsValues}});
        await product.setColors(colorsInstances);
    }

    const materialsValues = materials ? materials.split(',').map(material => Number(material)) : [];
    if (materials) {
        const materialsInstances = await Material.findAll({where: {id: materialsValues}});
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

    eventEmitter.emit('productUpdated', {
        productId,
        product,
    });

    await handlePriceChange(oldPrice, updatedProduct);

    return product;
};

const handlePriceChange = async (oldPrice, newProduct) => {
    if (oldPrice !== newProduct.price) {
        eventEmitter.emit('alert:productPriceChanged', {
            productId: newProduct.dataValues.id,
            oldPrice: oldPrice,
        });
    }

    return newProduct;
}

const deleteProduct = async (productId) => {
    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    await product.destroy();

    eventEmitter.emit('productDeleted', productId);
};

const generateFacets = async (value = '', attributes = [
    'name',
    'description'
]) => {
    try {
        const facetsType = {
            categories: {
                label: 'Catégories',
                type: 'checkbox',
                attribute: 'categories'
            },
            brands: {
                label: 'Marques',
                type: 'checkbox',
                attribute: 'brand'
            },
            colors: {
                label: 'Couleurs',
                type: 'checkbox',
                attribute: 'colors'
            },
            materials: {
                label: 'Matériaux',
                type: 'checkbox',
                attribute: 'materials'
            },
            price: {
                label: 'Prix',
                type: 'range',
                attribute: 'price'
            },
            weight: {
                label: 'Poids',
                type: 'range',
                attribute: 'weight'
            },
        };

        return await generateProductFacets(
                {
                    value,
                    attributes
                },
                facetsType,
                MongooseProduct
        );
    } catch (error) {
        console.error(error);
    }
}

const getCategoryIdsByProduct = async (productId) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    const product = await Product.findByPk(productId, {
        include: [
            {
                association: 'categories',
                attributes: ['id'],
                through: {attributes: []},
            }
        ],
    });

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    return await product.categories.map(category => category.id);
}

const generateProductURL = (productId) => {
    return `${config.frontendUrl}/products/${productId}`;
}

module.exports = {
    countProducts,
    countMatchingProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    generateFacets,
    getCategoryIdsByProduct,
    generateProductURL,
};
