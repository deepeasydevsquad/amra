const express = require("express");
const controllers = require("../modules/peminjaman/controllers/index");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/peminjaman");
const router = express.Router();

/**
 * menambah peminjaman jamaah
 */
router.post(
  "/add-peminjaman",
  authenticateToken,
  [
    body("dp").trim(),
    body("jamaah_id").notEmpty().withMessage("Id Jamaah Tidak Boleh Kosong.").custom(validation.check_id_jamaah),
    body("mulai_bayar").notEmpty().withMessage("Tanggal Mulai Bayar Tidak Boleh Kosong.").isDate({ format: 'YYYY-MM-DD' }).withMessage('Format Tanggal Mulai Bayar Tidak Sesuai'),
    body("nominal").notEmpty().withMessage("Nominal Peminjaman Tidak Boleh Kosong."),
    body("sudah_berangkat"),
    body("tenor").notEmpty().withMessage("Tenor Tidak Boleh Kosong.").isNumeric().withMessage('Tenor hanya boleh berisi angka tanpa spasi atau simbol lainnya'),
  ],
  controllers.addPinjaman
);

/**
 * menambah peminjaman jamaah
 */
router.post("/get-peminjaman", authenticateToken, controllers.daftarPinjaman);

/**
 * mengambil informasi peminjaman
 */
router.post("/get-skema", 
  authenticateToken,  
  [
    body("peminjaman_id").trim().notEmpty().withMessage("Id Jamaah Tidak Boleh Kosong.").custom(validation.check_id_peminjaman),
  ], 
  controllers.SkemaByID);

/**
 * mengambil informasi peminjaman
 */
router.post(
  "/update-skema",
  authenticateToken,
  [
    body("peminjaman_id").notEmpty().withMessage("id peminjaman tidak boleh kosong.").custom(validation.check_id_peminjaman),
    body("updatedSkema").custom(validation.check_skema),
  ],
  controllers.updateSkema
);

/**
 * mengambil informasi peminjaman
 */
router.post(
  "/bayar-perbulan",
  authenticateToken,
  [
    body("peminjaman_id").notEmpty().withMessage("id peminjaman tidak boleh kosong."),
    body("nominal").notEmpty().withMessage("nominal tidak boleh kosong."),
  ],
  controllers.pembayaranPerbulan
);

module.exports = router;
