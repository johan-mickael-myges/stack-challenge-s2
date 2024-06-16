'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_promotions', {
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
      },
      promotionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'promotions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_promotions');
  },
};
