const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/transaksi_visa/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

// Import validasi custom
const validation = require("../validation/transaksi_visa.js");
const visaValidasi = require("../validation/visa");

const router = express.Router();

// RUTE UNTUK MENGAMBIL LIST DATA
router.post(
  "/daftar-transaksi-visa/get-transaksi-visa/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
    body("filter").trim(),
  ],
  controllers.getDaftarTransaksiVisa
);

// RUTE UNTUK MENYIMPAN DATA BARU DENGAN VALIDASI LENGKAP
router.post(
  "/daftar-transaksi-visa/add-new",
  authenticateToken,
  visaValidasi,
  controllers.add_transaksi_visa
);

// RUTE UNTUK UPDATE DATA
router.put(
  "/daftar-transaksi-visa/update/:id",
  authenticateToken,
  [
    param("id", "ID tidak valid")
      .isInt({ min: 1 })
      .withMessage("ID harus berupa angka positif")
      .custom(validation.check_transaksi_visa_exists),

    body("invoice").optional().trim().custom(validation.check_invoice_unique),

    body("payer")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Nama pelanggan harus 2-100 karakter"),

    body("payer_identity")
      .optional()
      .trim()
      .isLength({ min: 10, max: 20 })
      .withMessage("Nomor identitas harus 10-20 karakter")
      .custom(validation.check_identity_number_unique),

    body("gender").optional().trim().custom(validation.check_gender),

    body("birth_date")
      .optional()
      .isISO8601()
      .toDate()
      .custom(validation.check_birth_date),

    body("jenis_visa").optional().trim().custom(validation.check_visa_type),

    body("passport_number")
      .optional()
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Nomor passport harus 6-20 karakter")
      .custom(validation.check_passport_number_unique),

    body("passport_expire_date")
      .optional()
      .isISO8601()
      .toDate()
      .custom(validation.check_passport_dates),

    body("postal_code").optional().trim().custom(validation.check_postal_code),

    body("city")
      .optional()
      .isInt({ min: 1 })
      .withMessage("ID Kota harus berupa angka")
      .custom(validation.check_city_id),

    body("phone").optional().trim().custom(validation.check_phone_number),

    body("valid_until")
      .optional()
      .isISO8601()
      .toDate()
      .custom(validation.check_valid_until),

    body("price").optional().isNumeric().custom(validation.check_price),
  ],
  controllers.updateTransaksiVisa
);

// RUTE UNTUK DELETE DATA
router.delete(
  "/daftar-transaksi-visa/delete/:id",
  authenticateToken,
  [
    param("id", "ID tidak valid")
      .isInt({ min: 1 })
      .withMessage("ID harus berupa angka positif")
      .custom(validation.check_visa_transaction_exists),
  ],
  controllers.deleteTransaksiVisa
);

// RUTE UNTUK GET ALL CITIES
router.get(
  "/transaksi-visa/get-all-cities",
  authenticateToken,
  controllers.getAllCities
);

// RUTE UNTUK GET ALL VISA TYPES
router.get(
  "/transaksi-visa/get-all-visa-types",
  authenticateToken,
  controllers.getAllVisaTypes
);

module.exports = router;
