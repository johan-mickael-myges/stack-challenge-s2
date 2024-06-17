const { Category } = require('~models');
const {buildQueryOptions} = require("../../utils/queryOptionsFactory");

const getAllCategories = async (req, res) => {
    try {
        let options = buildQueryOptions(req.query);

        const categories = await Category.findAndCountAll(options);
        res.json({
            total: categories.count,
            page: options.page,
            limit: options.limit,
            items: categories.rows,
        });
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

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (category) {
            await category.update({ name });
            res.json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: errMessage });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            await category.destroy();
            res.status(204).send();
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
    createCategory,
    updateCategory,
    deleteCategory,
};
