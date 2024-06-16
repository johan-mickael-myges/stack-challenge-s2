const { Category } = require('../../models');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
};
