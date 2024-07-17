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
                username: 'admin',
                firstname: 'Admin',
                lastname: 'Admin',
                email: 'admin@layalin.com',
                number: '0769348744',
                password: await bcrypt.hash('admin', salt),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const maxId = await queryInterface.sequelize.query('SELECT MAX(id) as lastId FROM users');

        await queryInterface.bulkInsert('user_roles', [
            {
                userId: maxId[0][0].lastid,
                roleId: ROLE_ADMIN,
            }
        ]);

        await queryInterface.sequelize.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('user_roles', { userId: 1 });
        await queryInterface.bulkDelete('users', { id: 1 });
    }
};
