'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await queryInterface.sequelize.query(
            `SELECT id from products;`
    );
    const materials = await queryInterface.sequelize.query(
            `SELECT id from materials;`
    );

    const productRows = products[0];
    const materialRows = materials[0];

    const existingCombinations = new Set();
    const productMaterials = [];

    productRows.forEach(product => {
      const randomAmount = Math.floor(Math.random() * 3) + 1; // Random amount between 1 and 3

      for (let i = 0; i < randomAmount; i++) {
        let randomMaterial;
        let combination;

        do {
          randomMaterial = faker.helpers.arrayElement(materialRows);
          combination = `${product.id}-${randomMaterial.id}`;
        } while (existingCombinations.has(combination));

        existingCombinations.add(combination);

        productMaterials.push({
          productId: product.id,
          materialId: randomMaterial.id,
        });
      }
    });

    await queryInterface.bulkInsert('product_materials', productMaterials, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_materials', null, {});
  }
};
