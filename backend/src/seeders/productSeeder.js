'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const categories = await queryInterface.sequelize.query(
                'SELECT id, name FROM categories WHERE name IN (\'Earrings\', \'Rings\', \'Necklace\');',
                { type: Sequelize.QueryTypes.SELECT }
        );

        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.name] = category.id;
        });

        const products = [
            {
                name: 'Product 1',
                reference: 'REF1234512343',
                description: 'Description for product 1',
                price: 10.0,
                images: 'UrlOfimage1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Product 2',
                reference: 'REF8888777382778',
                description: 'Description for product 2',
                price: 20.0,
                images: 'UrlOfimage2',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('products', products, {});

        const productCategories = [
            {
                ProductId: 1,
                CategoryId: categoryMap['Earrings'],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                ProductId: 1,
                CategoryId: categoryMap['Rings'],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                ProductId: 2,
                CategoryId: categoryMap['Necklace'],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('productCategories', productCategories, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('products', null, {});
        await queryInterface.bulkDelete('productCategories', null, {});
    }
};
