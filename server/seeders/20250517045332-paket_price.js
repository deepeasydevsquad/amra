'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Paket_prices', [
      { 
        paket_id: 1,
        mst_paket_type_id: 1,
        price: 30000000,
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Paket_prices', null, {});
  }
};