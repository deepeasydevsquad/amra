"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Transport_transactions", [
      {
        company_id: 1, // sesuaikan dengan ID company yang ada
        invoice: "AB12",
        petugas: "Sony Kurniawan",
        payer: "Tuan Muda",
        payer_identity: "1234567890",
        address: "Jalan Kenangan No.88",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transport_transactions", null, {});
  },
};
