'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('quantities');
  },

  async down (queryInterface, Sequelize) {
    // No op
  }
};
