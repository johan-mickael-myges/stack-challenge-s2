const { Product } = require('../../models');

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

module.exports = {
    getAllProducts,
    getProductById,
};
