'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('shipping_methods', [
      {
        name: 'Livraison Standard',
        cost: 5.99,
        minEstimatedDeliveryTime: 3,
        maxEstimatedDeliveryTime: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Livraison Express',
        cost: 15.99,
        minEstimatedDeliveryTime: 1,
        maxEstimatedDeliveryTime: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Livraison Gratuite',
        cost: 0.00,
        minEstimatedDeliveryTime: 5,
        maxEstimatedDeliveryTime: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const maxId = await queryInterface.sequelize.query('SELECT MAX(id) as lastId FROM shipping_methods');
    await queryInterface.sequelize.query(`SELECT setval('shipping_methods_id_seq', (SELECT MAX(id) FROM shipping_methods));`);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('shipping_methods', null, {});
  }
};