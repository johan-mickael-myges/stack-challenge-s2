const { Product } = require('~models');

const count = async () => {
    return Product.count();
}

const all = async (options = {}) => {
    return await Product.findAll(options);
};

const one = async (id, options = {}) => {
    return Product.findByPk(id, options);
}

module.exports = {
    count,
    all,
    one,
};
