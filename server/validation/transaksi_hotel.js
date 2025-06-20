// server/validators/hotelTransactionValidator.js
const { body } = require("express-validator");
const { Hotel_transactions } = require("../models"); // <- sesuaikan path ke model lu

const hotelTransactionValidator = [
  // Validasi invoice (opsional, kalo dikirim manual)
  body("invoice")
    .optional()
    .custom(async (value) => {
      const exist = await Hotel_transactions.findOne({
        where: { invoice: value },
      });
      if (exist) {
        throw new Error("Invoice sudah digunakan.");
      }
      return true;
    }),

  // Validasi array detail tamu
  body("details")
    .isArray({ min: 1 })
    .withMessage("Minimal harus ada 1 tamu detail"),

  body("details.*.name").notEmpty().withMessage("Nama tamu tidak boleh kosong"),

  body("details.*.birth_date")
    .notEmpty()
    .withMessage("Tanggal lahir tamu wajib diisi"),

  body("details.*.birth_place")
    .notEmpty()
    .withMessage("Tempat lahir tamu wajib diisi"),

  body("details.*.identity_number")
    .notEmpty()
    .withMessage("Nomor identitas tamu wajib diisi"),

  body("details.*.mst_hotel_id")
    .isInt()
    .withMessage("ID hotel harus berupa angka"),

  body("details.*.mst_kota_id")
    .isInt()
    .withMessage("ID kota harus berupa angka"),

  body("details.*.price").isNumeric().withMessage("Harga harus berupa angka"),

  body("details.*.check_in")
    .isISO8601()
    .withMessage("Format check-in tidak valid"),

  body("details.*.check_out")
    .isISO8601()
    .withMessage("Format check-out tidak valid"),

  // Custom validasi: hanya boleh 1 payer
  body("details").custom((details) => {
    const payerCount = details.filter((d) => d.payer === true).length;
    if (payerCount > 1) {
      throw new Error("Hanya boleh 1 tamu yang ditandai sebagai payer.");
    }
    return true;
  }),
];

module.exports = {
  hotelTransactionValidator,
};
