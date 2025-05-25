const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/buku_besar/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const getCompanyId = require("../middleware/getCompanyId");
const validation = require("../validation/buku_besar");

const router = express.Router();

router.post("/daftar_buku_besar/list",
  authenticateToken,
  [
    body("pageNumber").trim().notEmpty().withMessage("Page Number tidak boleh kosong."),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
    body("akun").trim().notEmpty().withMessage("Akun tidak boleh kosong.").custom(validation.check_akun_id),
    body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong.").custom(validation.check_cabang_id),
    body("periode").trim().notEmpty().withMessage("Periode tidak boleh kosong.").custom(validation.check_periode_id),
  ],
  controllers.list
);

router.post(
  "/daftar_buku_besar/download_data_buku_besar",
  authenticateToken,
  [
    body("akun").trim().notEmpty().withMessage("Akun tidak boleh kosong.").custom(validation.check_akun_id),
    body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong.").custom(validation.check_cabang_id),
    body("periode").trim().notEmpty().withMessage("Periode tidak boleh kosong.").custom(validation.check_periode_id),
  ],
  controllers.downloadDataPeminjaman
);

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

// update

// //
// router.put(
//   "/daftar_kota/:id",
//   authenticateToken,
//   getCompanyId,
//   [
//     param("id").isInt().withMessage("ID harus berupa angka."),
//     body("kode").trim().notEmpty().withMessage("Kode tidak boleh kosong."),
//     body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
//   ],
//   controllers.update_daftar_kota
// );

// router.post(
//   "/daftar_kota/delete",
//   authenticateToken,
//   [body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").isInt().withMessage("ID Kota harus berupa angka.").custom(validation.check_id_kota)],
//   controllers.delete
// );

module.exports = router;
