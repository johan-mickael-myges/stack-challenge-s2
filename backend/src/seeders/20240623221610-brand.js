'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const amount = 6;
    const brandNames = new Set();

    while (brandNames.size < amount) {
      brandNames.add(faker.commerce.productMaterial());
    }

    const brands = Array.from(brandNames).map(name => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkDelete('brands', null, {});
    await queryInterface.bulkInsert('brands', brands, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brands', null, {});
  }
};
