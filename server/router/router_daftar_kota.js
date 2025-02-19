const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/daftar_kota/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const getCompanyId = require("../middleware/getCompanyId");

const router = express.Router();

router.get("/daftar_kota", authenticateToken, controllers.get_daftar_kota);

router.post(
  "/daftar_kota",
  authenticateToken,
  getCompanyId,
  [
    body("kode").trim().notEmpty().withMessage("Kode tidak boleh kosong."),
    body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
  ],
  controllers.create_daftar_kota
);

router.put(
  "/daftar_kota/:id",
  authenticateToken,
  getCompanyId,
  [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("kode").trim().notEmpty().withMessage("Kode tidak boleh kosong."),
    body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
  ],
  controllers.update_daftar_kota
);

router.delete(
  "/daftar_kota/:id",
  authenticateToken,
  getCompanyId,
  [param("id").isInt().withMessage("ID harus berupa angka.")],
  controllers.delete_daftar_kota
);

module.exports = router;
