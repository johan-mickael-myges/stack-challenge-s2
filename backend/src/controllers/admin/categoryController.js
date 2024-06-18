const { Category } = require('~models');
const {buildQueryOptions} = require("../../utils/queryOptionsFactory");

const getAllCategories = async (req, res) => {
    try {
        let options = buildQueryOptions(req.query);

        const categories = await Category.findAndCountAll(options);
        res.status(200).json({
            total: categories.count,
            items: categories.rows,
        });
    } catch (error) {
        res.status(500);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404);
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500);
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404);
        }
        await category.update({ name });
        res.json(category);
    } catch (error) {
        res.status(500);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404);
        }
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
