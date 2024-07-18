'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stocks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('in', 'out'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Le type est requis'
          },
          isIn: {
            args: [['in', 'out']],
            msg: 'Le type doit être "in" ou "out"'
          }
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La quantité est requise'
          },
          min: {
            args: [0],
            msg: 'La quantité doit être supérieure ou égale à 0'
          }
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products', // Make sure this matches the actual name of your products table
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        validate: {
          notEmpty: {
            msg: 'Le produit est requis'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stocks');
  }
};
