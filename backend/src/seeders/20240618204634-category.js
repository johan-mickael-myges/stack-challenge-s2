'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      { name: 'Bracelets', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Boucles', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Colliers', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bagues', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Montres', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkInsert('categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
