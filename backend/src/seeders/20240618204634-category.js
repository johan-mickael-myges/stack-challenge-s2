'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const amount = 10;
    const newCategories = new Set();

    while (newCategories.size < amount) {
      newCategories.add(faker.commerce.department());
    }

    const categoryArray = Array.from(newCategories).map(name => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkInsert('categories', categoryArray, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};