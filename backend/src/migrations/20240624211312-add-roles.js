'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // add ROLE_ADMIN, ROLE_USER
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'ROLE_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'ROLE_USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'ROLE_STORE_KEEPER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
