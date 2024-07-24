'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const materials = [
      { id: 1, name: 'Platine', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Or', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Argent', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Acier Inoxydable', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Diamond', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkDelete('materials', null, {});
    await queryInterface.bulkInsert('materials', materials, {});

    // Reset sequence for Postgres, if needed
    await queryInterface.sequelize.query(
            `ALTER SEQUENCE "materials_id_seq" RESTART WITH ${materials.length + 1};`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('materials', null, {});
  }
};