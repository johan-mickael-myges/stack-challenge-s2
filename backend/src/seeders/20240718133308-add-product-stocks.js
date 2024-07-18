'use strict';

const { Product } = require('../models'); // Adjust the path as needed

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await Product.findAll(); // Assuming you have some products already seeded

    if (products.length === 0) {
      console.log('No products found. Seed products first.');
      return;
    }

    const stocks = [];

    for (const product of products) {
      stocks.push({
        type: 'in',
        quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
        productId: product.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      stocks.push({
        type: 'out',
        quantity: Math.floor(Math.random() * 50) + 1, // Random quantity between 1 and 50
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