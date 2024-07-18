const { Stock, Product } = require('~models');
const BadRequestError = require('~errors/BadRequestError');
const NotFoundError = require('~errors/NotFoundError');

const getAllForProduct = async (productId) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    return Stock.findAll({
        where: { productId }
    });
}

module.exports = {
    getAllForProduct,
}