'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Kostumer_paket_las', [
      { 
        company_id: 1, 
        name: 'Zamzam Wisata Islami',
        mobile_number : '0862712512', 
        address : 'Medan', 
        createdAt: new Date(), 
        updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kostumer_paket_las', null, {});
  }
};
