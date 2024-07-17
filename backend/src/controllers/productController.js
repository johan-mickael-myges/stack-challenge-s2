const { Product } = require('~models');
const {buildQueryOptions} = require("~utils/queryOptionsFactory");
const repository = require("~repositories/productRepository");
const { uploadToS3 } = require('~services/s3Service');

exports.countProducts = async (req, res, next) => {
    try {
        const count = await repository.count(req.user);
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        let options = buildQueryOptions(req.query);

        const products = await repository.all(options);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await repository.one(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.thumbnail = await uploadToS3(req.file, 'products', 'product');
        }

        const product = await Product.create(req.body);

        res.status(201).json(product);
        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.thumbnail = await uploadToS3(req.file);
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }

        await product.update(req.body);

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }
        await product.destroy();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
