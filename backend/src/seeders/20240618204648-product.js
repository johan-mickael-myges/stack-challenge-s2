'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const amount = 25;
    const products = [];

    for (let i = 0; i < amount; i++) {
      products.push({
        name: faker.commerce.productName(),
        reference: faker.string.alphanumeric(10),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url(),
        images: [faker.image.url(), faker.image.url(), faker.image.url()],
        weight: Math.floor(Math.random() * 1000) / 100, // Random weight between 0 and 10
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};