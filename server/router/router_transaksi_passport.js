const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/transaksi_passport/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const validation = require("../validation/transaksi_passport.js");

const router = express.Router();

// RUTE UNTUK MENGAMBIL LIST DATA
router.post(
  "/daftar-transaksi-passport/get-transaksi-passport/list",
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
  controllers.getDaftarTransaksiPassport
);

router.post(
  "/daftar-transaksi-passport/add-new",
  authenticateToken,
  [
    body("kostumer_id")
      .notEmpty()
      .trim()
      .withMessage("Kostumer tidak boleh kosong."),
    body(
      "passport_details",
      "Detail passport harus berupa array dan tidak boleh kosong."
    )
      .isArray({ min: 1 })
      .withMessage("Setidaknya satu detail passport harus disediakan."),

    body("passport_details.*.name", "Nama pelanggan wajib diisi.")
      .notEmpty()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Nama pelanggan harus 2-100 karakter"),
    body("passport_details.*.identity_number", "Nomor Identitas wajib diisi.")
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 20 })
      .withMessage("Nomor identitas harus 10-20 karakter"),
    body("passport_details.*.kk_number", "Nomor KK wajib diisi.")
      .notEmpty()
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Nomor KK harus 6-20 karakter"),
    body("passport_details.*.birth_place", "Tempat Lahir wajib diisi.")
      .notEmpty()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Tempat lahir harus 2-50 karakter"),
    body("passport_details.*.birth_date", "Tanggal Lahir tidak valid.")
      .isISO8601()
      .toDate()
      .custom(validation.check_birth_date),
    body("passport_details.*.address", "Alamat wajib diisi.")
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage("Alamat harus 10-200 karakter"),
    body("passport_details.*.city", "Kota wajib dipilih.")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("ID Kota harus berupa angka")
      .custom(validation.check_city_id),
    body(
      "passport_details.*.price",
      "Harga harus berupa angka dan lebih dari 0."
    )
      .isNumeric()
      .custom(validation.check_price),
  ],
  controllers.addNewTransaksiPassport
);

router.get(
  "/transaksi-passport/get-all-cities",
  authenticateToken,
  controllers.getAllCities
);

router.post(
  "/transaksi-passport/daftar-paket",
  authenticateToken,
  [body("division_id").notEmpty().withMessage("ID Divisi tidak boleh kosong.")],
  controllers.daftar_paket
);

router.get(
  "/transaksi-passport/daftar-kostumer",
  authenticateToken,
  controllers.daftar_kostumer
);

router.delete(
  "/daftar-transaksi-passport/delete/:id",
  authenticateToken,
  [
    param("id", "ID tidak valid")
      .isInt({ min: 1 })
      .withMessage("ID harus berupa angka positif")
      .custom(validation.check_passport_transaction_exists),
  ],
  controllers.deleteTransaksiPassport
);

module.exports = router;
