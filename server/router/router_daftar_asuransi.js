const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_asuransi/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/daftar_asuransi");

const router = express.Router();

router.post(
  "/daftar_asuransi/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.get_daftar_asuransi
);

router.post(
  "/daftar_asuransi/",
  authenticateToken,
  [
    body("name").trim().notEmpty().withMessage("Nama Fasilitas tidak boleh kosong."),
  ],
  controllers.add
);

router.post(
  "/daftar_asuransi/update",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Fasilitas tidak boleh kosong.").custom(validation.check_id_asuransi),
    body("name").trim().notEmpty().withMessage("Nama Fasilitas tidak boleh kosong."),
  ],
  controllers.update
);

router.post(
  "/daftar_asuransi/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID Fasilitas tidak boleh kosong.").isInt().withMessage("ID Fasilitas harus berupa angka.").custom(validation.check_id_asuransi)],
  controllers.delete
);

module.exports = router;
