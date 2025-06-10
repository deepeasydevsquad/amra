'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Passport_transactions', [
      { 
        company_id: 1,
        invoice: 'ER21DH',
        petugas: 'Sony Kurniawan',
        payer: 'Ilham',
        payer_identity: '171273512123',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Passport_transactions', null, {});
  }
};
