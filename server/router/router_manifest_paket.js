const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/manifest_paket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/manifest_paket");

const router = express.Router();

router.post(
  "/daftar-manifest-paket/get-daftar-manifest-paket/list",
  authenticateToken,
  [
    body("paketId")
      .trim()
      .notEmpty().withMessage("ID paket tidak boleh kosong.")
      .isInt().withMessage("ID paket harus berupa angka.")
      .custom(validation.check_id_paket),
    body("pageNumber").trim(),
    body("perpage")
      .trim()
      .notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search")
      .trim()
  ],
  controllers.getDaftarManifestPaket
);

router.post(
  "/daftar-manifest-paket/get-info-update-manifest-paket",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID transaksi paket tidak boleh kosong.")
      .isInt().withMessage("ID transaksi paket harus berupa angka.")
      .custom(validation.check_id_transpaket),
  ],
  controllers.getInfoUpdaterManifestPaket
);

router.post(
  "/daftar-manifest-paket/update-manifest-paket",
  authenticateToken,
  [
    body("id")
      .trim()
      .isInt().withMessage("ID transaksi paket harus berupa angka.")
      .custom(validation.check_id_transpaket),
    body("nomor_passport")
      .trim(),
    body("tanggal_di_keluarkan_passport")
      .trim()
      .toDate(),
    body("tempat_di_keluarkan_passport")
      .trim(),
    body("masa_berlaku_passport")
      .trim()
      .toDate(),
    body("fullname")
      .trim()
      .notEmpty().withMessage("Nama tidak boleh kosong."),
    body("birth_date")
      .trim()
      .toDate(),
    body("birth_place")
      .trim()
  ],
  controllers.updateManifestPaket
);

router.post(
  "/daftar-manifest-paket/download-manifest-paket",
  authenticateToken,
  [
    body("paketId").custom(validation.check_id_paket)
  ],
  controllers.downloadManifestPaket
);

module.exports = router;
