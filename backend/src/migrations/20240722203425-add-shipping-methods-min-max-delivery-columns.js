'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('shipping_methods', 'estimatedDeliveryTime');
    await queryInterface.addColumn('shipping_methods', 'minEstimatedDeliveryTime', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    });
    await queryInterface.addColumn('shipping_methods', 'maxEstimatedDeliveryTime', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('shipping_methods', 'estimatedDeliveryTime', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn('shipping_methods', 'minEstimatedDeliveryTime');
    await queryInterface.removeColumn('shipping_methods', 'maxEstimatedDeliveryTime');
  }
};