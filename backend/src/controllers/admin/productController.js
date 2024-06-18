const { Product } = require('~models');
const {buildQueryOptions} = require("../../utils/queryOptionsFactory");

exports.getAllProducts = async (req, res) => {
    try {
        let options = buildQueryOptions(req.query);

        const products = await Product.findAndCountAll(options);
        res.status(200).json({
            total: products.count,
            items: products.rows,
        });
    } catch (error) {
        res.status(500);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500);
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }
        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404);
        }
        await product.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500);
    }
};
