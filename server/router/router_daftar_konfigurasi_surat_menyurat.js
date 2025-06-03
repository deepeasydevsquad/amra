const express = require("express");
const controllers = require("../modules/daftar_surat_menyurat/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();
const validasiKonfigurasiSurat = require("../validation/konfigurasi_surat");
const SuratValidator = require("../validation/add_surat");

console.log("Controllers Object:", controllers);

function debugBody(req, res, next) {
  console.log("Body sebelum validasi:", req.body);
  next();
}

router.post("/delete_surat", authenticateToken, controllers.deleteSurat);

router.post(
  "/add_surat",
  authenticateToken,
  SuratValidator(),
  controllers.addSurat
);

router.post(
  "/add_konfigurasi_surat",
  authenticateToken,
  validasiKonfigurasiSurat,
  controllers.addKonfigurasi
);

router.get(
  "/get_jamaah_surat",
  authenticateToken,
  controllers.get_daftar_jamaah
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

router.post(
  "/cetak_surat/:jenis_surat",
  authenticateToken,
  validasiKonfigurasiSurat,
  controllers.cetak_surat
);

module.exports = router;
