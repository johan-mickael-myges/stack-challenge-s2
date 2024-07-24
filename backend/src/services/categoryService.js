const {Category} = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");
const eventEmitter = require('~services/eventEmitter');

const countCategory = async() => {
    return Category.count();
}

const deleteCategory = async(categoryId) => {
    if (!categoryId) {
        throw new BadRequestError("category ID is required");
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new NotFoundError('Category not found');
    }

    const remainingCategories = await countCategory();
    if (remainingCategories === 1) {
        throw new BadRequestError('Cannot delete the last category');
    }

    await category.destroy();

    eventEmitter.emit('categoryDeleted', category.name);
}

module.exports = {
    countCategory,
    deleteCategory,
};
