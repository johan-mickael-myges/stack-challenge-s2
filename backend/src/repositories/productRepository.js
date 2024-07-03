const { Product } = require('~models');

const all = async (options = {}, user = {}) => {
    return await Product.findAndCountAll(options);
};

const one = async (id, options = {}, user = {}) => {
    return Product.findByPk(id, options);
}

module.exports = {
    all,
    one,
};
