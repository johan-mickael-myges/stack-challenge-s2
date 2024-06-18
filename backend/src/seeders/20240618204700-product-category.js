'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const productIds = await queryInterface.sequelize.query(
            'SELECT id FROM products;',
            { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryIds = await queryInterface.sequelize.query(
            'SELECT id FROM categories;',
            { type: Sequelize.QueryTypes.SELECT }
    );

    const productCategoryAssociations = [];

    productIds.forEach(product => {
      const numberOfCategories = faker.number.int({ min: 1, max: 3 }); // Each product will have between 1 and 3 categories
      const shuffledCategoryIds = faker.helpers.shuffle(categoryIds);
      for (let i = 0; i < numberOfCategories; i++) {
        productCategoryAssociations.push({
          productId: product.id,
          categoryId: shuffledCategoryIds[i].id,
        });
      }
    });

    await queryInterface.bulkInsert('product_categories', productCategoryAssociations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  },
};
