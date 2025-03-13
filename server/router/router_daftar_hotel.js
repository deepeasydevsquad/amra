const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_hotel/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/daftar_hotel");

const router = express.Router();

router.post(
  "/daftar_hotel/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.get_daftar_hotel
);

router.post(
  "/daftar_hotel/",
  authenticateToken,
  [
    body("kota").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong.").custom(validation.check_add_hotel),
    body("name").trim().notEmpty().withMessage("Nama Hotel tidak boleh kosong."),
    body("desc").trim().notEmpty().withMessage("Deskripsi Hotel tidak boleh kosong."),
    body("star").trim().notEmpty().withMessage("Bintang Hotel tidak boleh kosong.").isInt({ min: 1, max: 7 }).withMessage("Bintang Hotel harus berupa angka bulat antara 1 dan 7."),
  ],
  controllers.add
);

router.post(
  "/daftar_hotel/update",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").custom(validation.check_id_hotel),
    body("kota").trim().notEmpty().withMessage("Kota tidak boleh kosong.").custom(validation.check_edit_hotel),
    body("name").trim().notEmpty().withMessage("Nama Kota tidak boleh kosong."),
    body("desc").trim().notEmpty().withMessage("Deskripsi Kota tidak boleh kosong."),
    body("star").trim().notEmpty().withMessage("Bintang Kota tidak boleh kosong.").isInt({ min: 1, max: 5 }).withMessage("Bintang Kota harus berupa angka bulat antara 1 dan 5."),
  ],
  controllers.update
);

router.post(
  "/daftar_hotel/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID Kota tidak boleh kosong.").isInt().withMessage("ID Kota harus berupa angka.").custom(validation.check_id_hotel)],
  controllers.delete
);

module.exports = router;
