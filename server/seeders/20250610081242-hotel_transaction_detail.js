'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Hotel_transaction_details', [
      { 
        hotel_transaction_id: 1,
        name: 'Ilham',
        birth_date: '2000-05-01',
        birth_place: 'Langsa',
        identity_number: '171273512123',
        mst_hotel_id: 1,
        mst_kota_id: 1,
        price: 10000000,
        check_in: '2025-01-01',
        check_out: '2025-01-02',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Hotel_transaction_details', null, {});
  }
};
