const { Category } = require('~models');

const all = async (options = {}, user = {}) => {
    return await Category.findAndCountAll(options);
};

const one = async (id, options = {}, user = {}) => {
    return Category.findByPk(id, options);
}

module.exports = {
    all,
    one,
};
