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

const countStocks = async (stocks) => {
    let count = 0;

    for (let i = 0; i < stocks.length; i++) {
        let item = stocks[i];
        if (item['type'] === 'in') {
            count += item['quantity'];
        } else {
            count -= item['quantity'];
        }
    }

    return count;
}

const countRemainingForProduct = async (productId) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    const stocks = await Stock.findAll({
        where: { productId }
    });

    return countStocks(stocks);
}

module.exports = {
    getAllForProduct,
    countStocks,
    countRemainingForProduct,
}