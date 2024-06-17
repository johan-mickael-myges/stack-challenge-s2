'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const existingCategories = await queryInterface.sequelize.query(
            "SELECT name FROM categories;",
            { type: Sequelize.QueryTypes.SELECT }
        );

        const categoryNames = existingCategories.map((category) => category.name);

        const newCategories = [
            {
                name: 'Earrings',
            },
            {
                name: 'Rings',
            },
            {
                name: 'Necklace',
            },
        ];

        for (const category of newCategories) {
            if (!categoryNames.includes(category.name)) {
                await queryInterface.bulkInsert('categories', [category], {});
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('categories', null, {});
    },
};
