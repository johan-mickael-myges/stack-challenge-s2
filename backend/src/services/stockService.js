const { Stock, Product } = require('../models');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const { STOCK_TYPE_IN, STOCK_TYPE_OUT } = require('../constants/stock');
const eventEmitter = require('../services/eventEmitter');

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
        if (item['type'] === STOCK_TYPE_IN) {
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

const addProductStock = async (productId, quantity, type) => {
    if (!productId) {
        throw new BadRequestError('Product ID is required');
    }

    if (!quantity || quantity <= 0) {
        throw new BadRequestError('Quantity must be a positive number');
    }

    if (!type) {
        throw new BadRequestError('Type is required');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    const remaining = await countRemainingForProduct(productId);

    if (type === STOCK_TYPE_OUT && quantity > remaining) {
        throw new BadRequestError('Not enough stock');
    }

    const stock = await Stock.create({
        productId,
        quantity,
        type
    });

    if (type === STOCK_TYPE_IN) {
        eventEmitter.emit('alert:restock', productId);
    }

    eventEmitter.emit('stock:updated', product);

    return stock;
}

module.exports = {
    getAllForProduct,
    countStocks,
    countRemainingForProduct,
    addProductStock,
}