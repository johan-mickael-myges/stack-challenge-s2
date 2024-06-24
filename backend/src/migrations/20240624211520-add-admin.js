'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // add one admin
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                username: 'admin',
                firstname: 'Admin',
                lastname: 'Admin',
                email: 'admin@layalin.com',
                number: '0769348744',
                password: await bcrypt.hash('admin', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        await queryInterface.bulkInsert('user_roles', [
            {
                userId: 1,
                roleId: 1,
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('user_roles', { userId: 1 });
        await queryInterface.bulkDelete('users', { id: 1 });
    }
};
