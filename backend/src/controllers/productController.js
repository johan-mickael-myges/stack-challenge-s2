const { Product } = require('~models');
const {buildQueryOptions} = require("~utils/queryOptionsFactory");
const repository = require("~repositories/productRepository");

exports.getAllProducts = async (req, res, next) => {
    try {
        console.log('USER' , req.user);
        let options = buildQueryOptions(req.query);

        const products = await repository.all(options, req.user);
        res.status(200).json({
            total: products.count,
            items: products.rows,
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await repository.one(req.params.id, {});
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
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
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
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
