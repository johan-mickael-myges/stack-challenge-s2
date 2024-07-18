'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // remove quantity column in products table
    await queryInterface.removeColumn('products', 'quantity');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  }
};
