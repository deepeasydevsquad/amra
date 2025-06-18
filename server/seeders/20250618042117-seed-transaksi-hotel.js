"use strict";
const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    // Insert transaksi hotel utama
    await queryInterface.bulkInsert("Hotel_transactions", [
      {
        company_id: 1,
        invoice: "INV-HOTEL-" + Date.now(), // biar unik
        petugas: "Admin",
        payer: "Tuan Muda",
        payer_identity: "ID123456789",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Ambil ID transaksi barusan
    const [transaksi] = await queryInterface.sequelize.query(
      "SELECT id FROM `Hotel_transactions` ORDER BY id DESC LIMIT 1;"
    );

    const transaksiId = transaksi[0].id;

    // Insert detail tamu-tamu
    await queryInterface.bulkInsert("Hotel_transaction_details", [
      {
        hotel_transaction_id: transaksiId,
        name: "Azzam Fauzan",
        birth_date: "1998-02-10",
        birth_place: "Bandung",
        identity_number: "ID887766",
        mst_hotel_id: 1,
        mst_kota_id: 2,
        price: 350000,
        check_in: "2025-06-20",
        check_out: "2025-06-23",
        createdAt: now,
        updatedAt: now,
      },
      {
        hotel_transaction_id: transaksiId,
        name: "Fatimah Zahra",
        birth_date: "2000-09-15",
        birth_place: "Jakarta",
        identity_number: "ID554433",
        mst_hotel_id: 1,
        mst_kota_id: 2,
        price: 350000,
        check_in: "2025-06-20",
        check_out: "2025-06-23",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Hotel_transaction_details", null, {});
    await queryInterface.bulkDelete("Hotel_transactions", null, {});
  },
};
