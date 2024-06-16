'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const categories = await queryInterface.sequelize.query(
            "SELECT id, name FROM categories WHERE name IN ('Earrings', 'Rings', 'Necklace');",
            { type: Sequelize.QueryTypes.SELECT }
        );

        const categoryMap = {};
        categories.forEach((category) => {
            categoryMap[category.name] = category.id;
        });

        const products = [
            {
                name: 'Product 1',
                reference: 'REF1234512343',
                description: 'Description for product 1',
                price: 10.0,
                images: ['UrlOfimage1'],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Product 2',
                reference: 'REF8888777382778',
                description: 'Description for product 2',
                price: 20.0,
                images: ['UrlOfimage2'],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('products', products, {});

        const productCategories = [
            {
                productId: 1, // Ensure this matches the naming convention used in the `product_categories` table
                categoryId: categoryMap['Earrings'],
            },
            {
                productId: 1,
                categoryId: categoryMap['Rings'],
            },
            {
                productId: 2,
                categoryId: categoryMap['Necklace'],
            },
        ];

        await queryInterface.bulkInsert('product_categories', productCategories, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('products', null, {});
        await queryInterface.bulkDelete('product_categories', null, {});
    },
};
