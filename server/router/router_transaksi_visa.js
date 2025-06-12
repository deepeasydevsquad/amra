const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/transaksi_visa/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

// Import validasi custom
const validation = require("../validation/transaksi_visa.js");

const router = express.Router();

// RUTE UNTUK MENGAMBIL LIST DATA
router.post(
    "/daftar-transaksi-visa/get-transaksi-visa/list",
    authenticateToken,
    [
      body("pageNumber").trim(),
      body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
      body("search").trim(),
      body("filter").trim(),
    ],
    controllers.getDaftarTransaksiVisa
);

// RUTE UNTUK MENYIMPAN DATA BARU DENGAN VALIDASI LENGKAP
router.post(
    "/daftar-transaksi-visa/add-new", 
    authenticateToken,
    [
      body("invoice", "Invoice tidak boleh kosong.").notEmpty().trim()
        .custom(validation.check_invoice_unique),
      
      body("payer", "Nama Pelanggan tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 100 }).withMessage("Nama pelanggan harus 2-100 karakter"),
      
      body("payer_identity", "Nomor Identitas tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 10, max: 20 }).withMessage("Nomor identitas harus 10-20 karakter")
        .custom(validation.check_identity_number_unique),
      
      body("gender", "Jenis Kelamin tidak boleh kosong.").notEmpty().trim()
        .custom(validation.check_gender),
      
      body("birth_place", "Tempat Lahir tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Tempat lahir harus 2-50 karakter"),
      
      body("birth_date", "Tanggal Lahir tidak valid.").isISO8601().toDate()
        .custom(validation.check_birth_date),
      
      body("nationality", "Kewarganegaraan tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Kewarganegaraan harus 2-50 karakter"),
      
      body("jenis_visa", "Jenis Visa tidak boleh kosong.").notEmpty().trim()
        .custom(validation.check_visa_type),
      
      body("passport_number", "Nomor Passport tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 6, max: 20 }).withMessage("Nomor passport harus 6-20 karakter")
        .custom(validation.check_passport_number_unique),
      
      body("passport_issued_place", "Tempat Dikeluarkan Passport tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Tempat dikeluarkan harus 2-50 karakter"),
      
      body("passport_issued_date", "Tanggal Dikeluarkan Passport tidak valid.").isISO8601().toDate(),
      
      body("passport_expire_date", "Tanggal Berakhir Passport tidak valid.").isISO8601().toDate()
        .custom(validation.check_passport_dates),
      
      body("indonesia_job", "Pekerjaan di Indonesia tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 100 }).withMessage("Pekerjaan harus 2-100 karakter"),
      
      body("abroad_job", "Pekerjaan di Luar Negeri tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 100 }).withMessage("Pekerjaan harus 2-100 karakter"),
      
      body("work_address", "Alamat Pekerjaan tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 10, max: 200 }).withMessage("Alamat pekerjaan harus 10-200 karakter"),
      
      body("postal_code", "Kode Pos tidak valid.").notEmpty().trim()
        .custom(validation.check_postal_code),
      
      body("city", "Kota tidak boleh kosong.").notEmpty()
        .isInt({ min: 1 }).withMessage("ID Kota harus berupa angka")
        .custom(validation.check_city_id),
      
      body("origin_country", "Negara Asal tidak boleh kosong.").notEmpty().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Negara asal harus 2-50 karakter"),
      
      body("phone", "Nomor Telepon tidak boleh kosong.").notEmpty().trim()
        .custom(validation.check_phone_number),
      
      body("valid_until", "Tanggal Permohonan tidak valid.").isISO8601().toDate()
        .custom(validation.check_valid_until),
      
      body("price", "Harga harus berupa angka.").isNumeric()
        .custom(validation.check_price),
      
      body("payment_method", "Metode pembayaran harus boolean.").isBoolean(),
    ],
    controllers.addNewTransaksiVisa
);

// RUTE UNTUK UPDATE DATA 
router.put(
    "/daftar-transaksi-visa/update/:id",
    authenticateToken,
    [
        param("id", "ID tidak valid").isInt({ min: 1 }).withMessage("ID harus berupa angka positif")
            .custom(validation.check_transaksi_visa_exists),
        
        body("invoice").optional().trim()
            .custom(validation.check_invoice_unique),
        
        body("payer").optional().trim()
            .isLength({ min: 2, max: 100 }).withMessage("Nama pelanggan harus 2-100 karakter"),
        
        body("payer_identity").optional().trim()
            .isLength({ min: 10, max: 20 }).withMessage("Nomor identitas harus 10-20 karakter")
            .custom(validation.check_identity_number_unique),
        
        body("gender").optional().trim()
            .custom(validation.check_gender),
        
        body("birth_date").optional().isISO8601().toDate()
            .custom(validation.check_birth_date),
        
        body("jenis_visa").optional().trim()
            .custom(validation.check_visa_type),
        
        body("passport_number").optional().trim()
            .isLength({ min: 6, max: 20 }).withMessage("Nomor passport harus 6-20 karakter")
            .custom(validation.check_passport_number_unique),
        
        body("passport_expire_date").optional().isISO8601().toDate()
            .custom(validation.check_passport_dates),
        
        body("postal_code").optional().trim()
            .custom(validation.check_postal_code),
        
        body("city").optional()
            .isInt({ min: 1 }).withMessage("ID Kota harus berupa angka")
            .custom(validation.check_city_id),
        
        body("phone").optional().trim()
            .custom(validation.check_phone_number),
        
        body("valid_until").optional().isISO8601().toDate()
            .custom(validation.check_valid_until),
        
        body("price").optional().isNumeric()
            .custom(validation.check_price),
    ],
    controllers.updateTransaksiVisa
);

// RUTE UNTUK DELETE DATA
router.delete(
  "/daftar-transaksi-visa/delete/:id",
  authenticateToken,
  [
    param("id", "ID tidak valid").isInt({ min: 1 }).withMessage("ID harus berupa angka positif")
      .custom(validation.check_visa_transaction_exists)
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