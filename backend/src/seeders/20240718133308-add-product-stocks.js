'use strict';

const { Product } = require('../models');
const { STOCK_TYPE_IN, STOCK_TYPE_OUT } = require('../constants/stock');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await Product.findAll();

    if (products.length === 0) {
      console.log('No products found. Seed products first.');
      return;
    }

    const stocks = [];

    for (const product of products) {
      stocks.push({
        type: STOCK_TYPE_IN,
        quantity: Math.floor(Math.random() * 20) + 1, // Random quantity between 1 and 20
        productId: product.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      stocks.push({
        type: STOCK_TYPE_OUT,
        quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1 and 10
        productId: product.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('stocks', stocks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};