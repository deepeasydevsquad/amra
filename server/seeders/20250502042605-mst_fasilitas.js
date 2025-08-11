'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Mst_fasilitas', [
      { 
        company_id: 1,
        name: 'MUKENA', 
        nomor_akun: '19111',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        company_id: 1,
        name: 'KOPER BAGASI 24"', 
        nomor_akun: '19112',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        company_id: 1,
        name: 'TAS KABIN 18"', 
        nomor_akun: '19113',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        company_id: 1,
        name: 'TAS PASPOR', 
        nomor_akun: '19114',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        company_id: 1,
        name: 'BAKAL SERAGAM', 
        nomor_akun: '19115',
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Mst_fasilitas', null, {});
  }
};