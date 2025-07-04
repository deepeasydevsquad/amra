'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Pastikan ambil ID transaksi dari AB12, misal ID = 1
    await queryInterface.bulkInsert("Ticket_transaction_details", [
      {
        ticket_transaction_id: 1, 
        pax:1, 
        code_booking: 'AH22331',
        airlines_id: 1,
        departure_date: '2025-07-03',
        travel_price: 500000,
        costumer_price: 600000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ticket_transaction_id: 1, 
        pax:1, 
        code_booking: '34DD1212',
        airlines_id: 1,
        departure_date: '2025-07-03',
        travel_price: 800000,
        costumer_price: 900000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Ticket_transaction_details", null, {});
  },
};
