const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_provider_visa/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/daftar_provider_visa");

const router = express.Router();

router.post(
  "/daftar_provider_visa/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.get_daftar_provider_visa
);

router.post(
  "/daftar_provider_visa/",
  authenticateToken,
  [
    body("name").trim().notEmpty().withMessage("Nama Provider Visa tidak boleh kosong."),
  ],
  controllers.add
);

router.post(
  "/daftar_provider_visa/update",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Provider Visa tidak boleh kosong.").custom(validation.check_id_provider_visa),
    body("name").trim().notEmpty().withMessage("Nama Provider Visa tidak boleh kosong."),
  ],
  controllers.update
);

router.post(
  "/daftar_provider_visa/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID Provider Visa tidak boleh kosong.").isInt().withMessage("ID Provider Visa harus berupa angka.").custom(validation.check_id_provider_visa)],
  controllers.delete
);

module.exports = router;
