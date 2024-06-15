const { Product } = require('../models');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newProduct = await Product.create({ name, description, price });
        res.status(201).json(newProduct);
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update({ name, description, price });
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
