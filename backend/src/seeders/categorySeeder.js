'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Earrings',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Rings',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Necklace',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('categories', null, {});
    }
};
