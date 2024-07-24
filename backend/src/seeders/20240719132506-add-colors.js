'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const colors = [
      { id: 1, name: 'Argent', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Or', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Rose', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkDelete('colors', null, {});
    await queryInterface.bulkInsert('colors', colors, {});

    // Reset sequence for Postgres, if needed
    await queryInterface.sequelize.query(
            `ALTER SEQUENCE "colors_id_seq" RESTART WITH ${colors.length + 1};`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('colors', null, {});
  }
};