'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const brands = [
      { id: 1, name: 'Tiffany & Co.', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Cartier', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Bulgari', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Van Cleef & Arpels', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Piaget', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Jewerly', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Pandora', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkDelete('brands', null, {});
    await queryInterface.bulkInsert('brands', brands, {});

    // Reset sequence for Postgres, if needed
    await queryInterface.sequelize.query(
            `ALTER SEQUENCE "brands_id_seq" RESTART WITH ${brands.length + 1};`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brands', null, {});
  }
};