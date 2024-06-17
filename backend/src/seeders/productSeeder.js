'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const categories = await queryInterface.sequelize.query(
            "SELECT id, name FROM categories WHERE name IN ('Earrings', 'Rings', 'Necklace');",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const existingReferences = await queryInterface.sequelize.query(
            "SELECT reference FROM products;",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const referenceSet = new Set(existingReferences.map((product) => product.reference));

        const categoryMap = {};
        categories.forEach((category) => {
            categoryMap[category.name] = category.id;
        });

        const products = [
            {
                name: 'Product 1',
                reference: 'REF1234512343',
                description: 'Description for product 1',
                price: 150.0,
                images: ['https://www.cartier.com/variants/images/1647597332270633/img1/w1242_tpadding12.jpg'],
                quantity: 132
            },
            {
                name: 'Product 2',
                reference: 'REF8888777382778',
                description: 'Description for product 2',
                price: 581.99,
                images: ['https://www.cartier.com/variants/images/1647597332270633/img1/w1242_tpadding12.jpg'],
                quantity: 51
            },
        ];
        for (const product of products) {
            if (!referenceSet.has(product.reference)) {
                await queryInterface.bulkInsert('products', products, {});
                const productCategories = [
                    {
                        ProductId: 1, // Ensure this matches the naming convention used in the `product_categories` table
                        categoryId: categoryMap['Earrings'],
                    },
                    {
                        ProductId: 1,
                        categoryId: categoryMap['Rings'],
                    },
                    {
                        ProductId: 2,
                        categoryId: categoryMap['Necklace'],
                    },
                ];
        
                await queryInterface.bulkInsert('product_categories', productCategories, {});
            }
        }
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('products', null, {});
        await queryInterface.bulkDelete('product_categories', null, {});
    },
};
