'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    // Pastikan ambil ID transaksi dari AB12, misal ID = 1
    await queryInterface.bulkInsert("Ticket_transactions", [
      {
        division_id: 1, 
        nomor_register: 'XZ171668',
        total_transaksi: 1500000,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Ticket_transactions", null, {});
  },
};
