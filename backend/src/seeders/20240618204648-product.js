'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const amount = 100;
    const products = [];

    for (let i = 0; i < amount; i++) {
      products.push({
        name: faker.commerce.productName(),
        reference: faker.string.alphanumeric(10),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        images: [faker.image.url()],
        quantity: faker.number.int(1, 100),
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