const repository = require('~repositories/productRepository');
const productService = require('~services/productService');
const { buildQueryOptions } = require('~utils/queryOptionsFactory');

exports.countProducts = async (req, res, next) => {
    try {
        const count = await repository.count(req.user);
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        console.log('USER' , req.user);
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
        const product = await productService.createProduct(req.body, req.files);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.files);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};