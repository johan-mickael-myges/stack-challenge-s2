'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('colors', [
      { name: 'Gold', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Silver', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Platinum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rose Gold', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('colors', null, {});
  }
};