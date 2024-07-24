'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const alerts = [
      {
        type: 'new_product',
        description: 'Alerte pour un nouveau produit dans une catégorie',
      },
      {
        type: 'restock',
        description: 'Alerte pour le réapprovisionnement d\'un produit',
      },
      {
        type: 'price_change',
        description: 'Alerte pour le changement de prix',
      },
      {
        type: 'newsletter',
        description: 'Alerte pour la newsletter',
      },
    ];

    await queryInterface.bulkInsert('alerts', alerts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('alerts', null, {});
  }
};