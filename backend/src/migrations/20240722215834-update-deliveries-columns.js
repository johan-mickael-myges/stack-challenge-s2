'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deliveries', 'recipientName');
    await queryInterface.addColumn('deliveries', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom du destinataire est requis',
        },
        len: {
          args: [1, 255],
          msg: 'Le prénom du destinataire doit comporter entre 1 et 255 caractères',
        },
      },
    });
    await queryInterface.addColumn('deliveries', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du destinataire est requis',
        },
        len: {
          args: [1, 255],
          msg: 'Le nom du destinataire doit comporter entre 1 et 255 caractères',
        },
      },
    });
    await queryInterface.addColumn('deliveries', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10, 15],
          msg: 'Le numéro de téléphone doit comporter entre 10 et 15 caractères',
        },
        isNumeric: {
          msg: 'Le numéro de téléphone doit contenir uniquement des chiffres',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deliveries', 'recipientName', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du destinataire est requis',
        },
        len: {
          args: [1, 255],
          msg: 'Le nom du destinataire doit comporter entre 1 et 255 caractères',
        },
      },
    });
    await queryInterface.removeColumn('deliveries', 'firstName');
    await queryInterface.removeColumn('deliveries', 'lastName');
    await queryInterface.removeColumn('deliveries', 'phoneNumber');
  }
};
