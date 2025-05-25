const express = require("express");
const controllers = require("../modules/daftar_surat_menyurat/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();
const validasiKonfigurasiSurat = require("../validation/konfigurasi_surat");

console.log("Controllers Object:", controllers);

function debugBody(req, res, next) {
  console.log("Body sebelum validasi:", req.body);
  next();
}

router.post(
  "/add_konfigurasi_surat",
  authenticateToken,
  debugBody,
  validasiKonfigurasiSurat,
  controllers.addKonfigurasi
);

router.post(
  "/get_konfigurasi_surat",
  authenticateToken,
  controllers.get_konfigurasi
);

router.post(
  "/get_riwayat_surat",
  authenticateToken,
  controllers.get_riwayat_surat
);

module.exports = router;
