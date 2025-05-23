'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Members', [
      { 
        division_id: 1, 
        fullname: 'Muhammad Iqbal', 
        identity_number: '123456789',
        identity_type: 'ktp',
        gender: 'laki_laki',
        photo : null, 
        birth_date : '2000-01-01',
        birth_place : 'Langsa',
        whatsapp_number : '085262802222',
        password: '$2a$10$JaWTb5ThDztEgIdgkioBWuBowG7UrhDNJoegQG6RmiVsb2HFEi.H.',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        division_id: 1, 
        fullname: 'Muhammad Faisal', 
        identity_number: '123555555',
        identity_type: 'ktp',
        gender: 'laki_laki',
        photo : null, 
        birth_date : '2001-01-01',
        birth_place : 'Langsa',
        whatsapp_number : '085262803333',
        password: '$2a$10$JaWTb5ThDztEgIdgkioBWuBowG7UrhDNJoegQG6RmiVsb2HFEi.H.',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', null, {});
  }
};
