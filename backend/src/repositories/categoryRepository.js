const { Category } = require('~models');

const count = async () => {
    return Category.count();
}

const all = async (options = {}) => {
    return await Category.findAll(options);
};

const one = async (id, options = {}) => {
    return Category.findByPk(id, options);
}

module.exports = {
    all,
    count,
    one,
};