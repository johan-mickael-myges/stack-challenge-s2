'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('configs', [
      { key: 'paypal.client', value: process.env.PAYPAL_CLIENT_ID },
      { key: 'paypal.secret', value: process.env.PAYPAL_SECRET },
    ]);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('configs', {
        key: ['paypal.client', 'paypal.secret']
    });
  }
};
