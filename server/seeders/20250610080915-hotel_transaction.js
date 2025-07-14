'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Hotel_transactions', [
      { 
        company_id: 1,
        invoice: 'ER21DH',
        petugas: 'Sony Kurniawan',
        kostumer_id: 1,
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Hotel_transactions', null, {});
  }
};
