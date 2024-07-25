'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deliveries', 'billingFirstName', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom de facturation est requis',
        },
        len: {
          args: [1, 255],
          msg: 'Le prénom de facturation doit comporter entre 1 et 255 caractères',
        },
      },
    });
    await queryInterface.addColumn('deliveries', 'billingLastName', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom de facturation est requis',
        },
        len: {
          args: [1, 255],
          msg: 'Le nom de facturation doit comporter entre 1 et 255 caractères',
        },
      },
    });
    await queryInterface.addColumn('deliveries', 'billingAddress', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'L\'adresse de facturation est requise',
        },
      },
    });
    await queryInterface.addColumn('deliveries', 'billingPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10, 15],
          msg: 'Le numéro de téléphone de facturation doit comporter entre 10 et 15 caractères',
        },
        isNumeric: {
          msg: 'Le numéro de téléphone de facturation doit contenir uniquement des chiffres',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deliveries', 'billingFirstName');
    await queryInterface.removeColumn('deliveries', 'billingLastName');
    await queryInterface.removeColumn('deliveries', 'billingAddress');
    await queryInterface.removeColumn('deliveries', 'billingPhoneNumber');
  }
};
