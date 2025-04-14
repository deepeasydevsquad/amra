const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/daftar_kostumer_paket_la/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/daftar_kostumer_paket_la");

const router = express.Router();

router.post(
  "/daftar_kostumer_paket_la/list",
  authenticateToken,  
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.get_daftar_kostumer_paket_la
);

router.post(
  "/daftar_kostumer_paket_la/",
  authenticateToken,
  [
    body("name").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong."),
    body("mobile_number").trim().notEmpty().withMessage("Nomor Telepon tidak boleh kosong."),
    body("address").trim().notEmpty().withMessage("Alamat tidak boleh kosong."),
  ],
  controllers.add
);

router.post(
  "/daftar_kostumer_paket_la/update",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").custom(validation.check_id_kostumer_paket_la),
    body("name").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong."),
    body("mobile_number").trim().notEmpty().withMessage("Nomor Telepon tidak boleh kosong."),
    body("address").trim().notEmpty().withMessage("Alamat tidak boleh kosong."),
  ],
  controllers.update
);

router.post(
  "/daftar_kostumer_paket_la/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").isInt().withMessage("ID Kota harus berupa angka.").custom(validation.check_id_kostumer_paket_la)],
  controllers.delete
);

module.exports = router;
