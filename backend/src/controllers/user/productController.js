const { Product } = require('~models');
const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'ASC' } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { reference: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const products = await Product.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            items: products.rows,
            total: products.count
        });
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

const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Name parameter is required' });
        }

        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        res.json(products);
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    searchProductsByName,
};
