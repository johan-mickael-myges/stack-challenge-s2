const productService = require('~services/productService');
const { buildQueryOptions } = require('~utils/queryOptionsFactory');
const { Product } = require('~models');

exports.countProducts = async (req, res, next) => {
    try {
        const count = await productService.countProducts(req.query);
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        let options = buildQueryOptions(req.query);

        const products = await productService.getAllProducts(options);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id, req.query);
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

exports.getFacets = async (req, res, next) => {
    try {
        const { terms } = req.query;
        const facets = await productService.generateFacets(terms);
        res.status(200).json(facets);
    } catch (error) {
        next(error);
    }
}