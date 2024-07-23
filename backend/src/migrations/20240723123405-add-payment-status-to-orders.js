'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('orders', 'paymentStatus', {
            type: Sequelize.ENUM('paid', 'not paid'),
            allowNull: false,
            defaultValue: 'not paid'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('orders', 'paymentStatus');
    }
};
