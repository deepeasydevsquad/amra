const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/neraca_lajur/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/neraca_lajur");

const router = express.Router();

router.post("/neraca_lajur/list",
  authenticateToken,
  [
    body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong.").custom(validation.check_cabang_id),
    body("periode").trim().notEmpty().withMessage("Periode tidak boleh kosong.").custom(validation.check_periode_id),
  ],
  controllers.list
);

// router.post(
//   "/daftar_buku_besar/download_data_buku_besar",
//   authenticateToken,
//   [
//     body("akun").trim().notEmpty().withMessage("Akun tidak boleh kosong.").custom(validation.check_akun_id),
//     body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong.").custom(validation.check_cabang_id),
//     body("periode").trim().notEmpty().withMessage("Periode tidak boleh kosong.").custom(validation.check_periode_id),
//   ],
//   controllers.downloadDataPeminjaman
// );

module.exports = router;
