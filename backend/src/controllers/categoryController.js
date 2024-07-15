const { Category } = require('~models');
const {buildQueryOptions} = require("~utils/queryOptionsFactory");
const repository = require("~repositories/categoryRepository");

const countCategories = async (req, res, next) => {
    try {
        const count = await repository.count();
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        let options = buildQueryOptions(req.query);
        const categories = await repository.all(options);
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const category = await repository.one(req.params.id, {});
        if (!category) {
            return res.sendStatus(404);
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.sendStatus(404);
        }
        await category.update({ name });
        res.json(category);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.sendStatus(404);
        }
        await category.destroy();
        res.sendStatus(204)
    } catch (error) {
        next(error);
    }
};

module.exports = {
    countCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
