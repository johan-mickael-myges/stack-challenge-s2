'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true,
      validate: {
        isFloat: {
          msg: 'Le poids doit être une valeur décimale',
        },
        min: {
          args: [0],
          msg: 'Le poids doit être une valeur positive',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'weight');
  },
};