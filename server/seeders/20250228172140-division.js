'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Divisions', [
      { 
        company_id : 1, 
        name : 'Cabang Langsa', 
        city : 'Langsa', 
        pos_code : '2232233', 
        address : 'Tes Alamat', 
        note: '', 
        tanda_tangan : '',
        createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Divisions', null, {});
  }
};
