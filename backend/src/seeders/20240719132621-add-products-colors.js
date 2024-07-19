'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await queryInterface.sequelize.query(
            `SELECT id from products;`
    );
    const colors = await queryInterface.sequelize.query(
            `SELECT id from colors;`
    );

    const productRows = products[0];
    const colorRows = colors[0];

    const existingCombinations = new Set();
    const productColors = [];

    productRows.forEach(product => {
      const randomAmount = Math.floor(Math.random() * 3) + 1; // Random amount between 1 and 3

      for (let i = 0; i < randomAmount; i++) {
        let randomColor;
        let combination;

        do {
          randomColor = faker.helpers.arrayElement(colorRows);
          combination = `${product.id}-${randomColor.id}`;
        } while (existingCombinations.has(combination));

        existingCombinations.add(combination);

        productColors.push({
          productId: product.id,
          colorId: randomColor.id,
        });
      }
    });

    await queryInterface.bulkInsert('product_colors', productColors, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_colors', null, {});
  }
};
