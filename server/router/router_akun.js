const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/akun/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const getCompanyId = require("../middleware/getCompanyId");
const validation = require("../validation/akun");

const router = express.Router();

// router.get("/daftar_kota", authenticateToken, controllers.get_daftar_kota);

router.get(
  "/akun/filter_akun",
  authenticateToken,
  controllers.filter_akun
);

router.post(
  "/daftar_akun/",
  authenticateToken,
  [
    body("akun").trim().notEmpty().withMessage("Akun tidak boleh kosong.").custom(validation.check_akun),
    body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong.").custom(validation.check_cabang),
  ],
  controllers.get_daftar_akun
);

router.post(
  "/daftar_akun/check_akun/",
  authenticateToken,
  [
    body("nomor_akun").trim().notEmpty().withMessage("Nomor Akun tidak boleh kosong.").custom(validation.check_nomor_akun),
    body("prefix").trim().notEmpty().withMessage("Prefix Nomor Akun tidak boleh kosong.").custom(validation.check_prefix),
    body("primary_id").trim().notEmpty().withMessage("Primary ID tidak boleh kosong.").custom(validation.check_primary_id),
  ],
  controllers.check_akun
);
// 

// router.post(
//   "/daftar_kota/",
//   authenticateToken,
//   [
//     body("kode").trim().notEmpty().withMessage("Kode Kota tidak boleh kosong.").custom(validation.check_add_kode_kota),
//     body("name").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong."),
//   ],
//   controllers.add
// );

// router.post(
//   "/daftar_kota/update",
//   authenticateToken,
//   [
//     body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").custom(validation.check_id_kota),
//     body("kode").trim().notEmpty().withMessage("Kode Kota tidak boleh kosong.").custom(validation.check_edit_kode_kota),
//     body("name").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong."),
//   ],
//   controllers.update
// );

// router.post(
//   "/daftar_kota/delete",
//   authenticateToken,
//   [body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").isInt().withMessage("ID Kota harus berupa angka.").custom(validation.check_id_kota)],
//   controllers.delete
// );

module.exports = router;
