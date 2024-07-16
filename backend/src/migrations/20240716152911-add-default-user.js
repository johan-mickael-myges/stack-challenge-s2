'use strict';

const bcrypt = require('bcrypt');

require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const { ROLE_ADMIN, ROLE_USER, ROLE_STORE_KEEPER } = require('../constants/roles');

const hashRounds = process.env.PASSWORD_SALT_ROUNDS;

if (!hashRounds) {
  throw new Error('PASSWORD_SALT_ROUNDS is not set in .env files');
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(Number(hashRounds));
    await queryInterface.bulkInsert('users', [
      {
        id: 2,
        username: 'user',
        firstname: 'User',
        lastname: 'User',
        email: 'user@layalin.com',
        number: '0669348744',
        password: await bcrypt.hash('user', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('user_roles', [
      {
        userId: 1,
        roleId: ROLE_USER,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', { userId: 2 });
    await queryInterface.bulkDelete('users', { id: 2 });
  }
};
