'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'deletionToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'deletionTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'anonymizationToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'anonymizationTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'deletionToken');
    await queryInterface.removeColumn('users', 'deletionTokenExpires');
    await queryInterface.removeColumn('users', 'anonymizationToken');
    await queryInterface.removeColumn('users', 'anonymizationTokenExpires');
  }
};
