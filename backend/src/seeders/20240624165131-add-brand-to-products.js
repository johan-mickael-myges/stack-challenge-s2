'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const productIds = await queryInterface.sequelize.query(
            'SELECT id FROM products;',
            { type: Sequelize.QueryTypes.SELECT }
    );

    const brandIds = await queryInterface.sequelize.query(
            'SELECT id FROM brands;',
            { type: Sequelize.QueryTypes.SELECT }
    );

    const productBrandAssociations = productIds.map(product => {
      const shouldHaveBrand = faker.datatype.boolean();
      return {
        productId: product.id,
        brandId: shouldHaveBrand ? faker.helpers.arrayElement(brandIds).id : null,
      };
    });

    for (const association of productBrandAssociations) {
      await queryInterface.sequelize.query(
        `UPDATE products SET "brandId" = ${association.brandId} WHERE id = ${association.productId};`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'UPDATE products SET brandId = NULL;'
    );
  },
};
