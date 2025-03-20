const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_mobil/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/daftar_mobil");

const router = express.Router();

router.post(
  "/daftar_mobil/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.get_daftar_mobil
);

router.post(
  "/daftar_mobil/",
  authenticateToken,
  [
    body("name").trim().notEmpty().withMessage("Nama Jenis Mobil tidak boleh kosong."),
  ],
  controllers.add
);

router.post(
  "/daftar_mobil/update",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Jenis Mobil tidak boleh kosong.").custom(validation.check_id_mobil),
    body("name").trim().notEmpty().withMessage("Nama Jenis Mobil tidak boleh kosong."),
  ],
  controllers.update
);

router.post(
  "/daftar_mobil/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID Jenis Mobil tidak boleh kosong.").isInt().withMessage("ID Jenis Mobil harus berupa angka.").custom(validation.check_id_mobil)],
  controllers.delete
);

module.exports = router;
