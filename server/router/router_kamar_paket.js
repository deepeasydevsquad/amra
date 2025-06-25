const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/kamar_paket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const validation = require("../validation/kamar_paket.js");

const router = express.Router();

// Rute untuk mengambil list data
router.post(
  "/daftar-kamar-paket/get-kamar-paket/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
    body("filter").trim(),
  ],
  controllers.getDaftarKamarPaket
);

// Rute untuk membuat kamar baru
router.post(
  "/daftar-kamar-paket/create-kamar",
  authenticateToken,
  validation.createKamar,
  controllers.createKamarPaket
);

// Rute untuk mengambil data hotel (untuk form dropdown)
router.get(
  "/daftar-kamar-paket/get-hotels",
  authenticateToken,
  controllers.getHotelsForForm
);

// Rute untuk mengambil data jamaah yang tersedia (untuk form dropdown)
router.get(
  "/daftar-kamar-paket/get-available-jamaah",
  authenticateToken,
  controllers.getAvailableJamaahForForm
);

// PERBAIKAN: Route download harus sebelum route dengan parameter :id
router.get(
  "/daftar-kamar-paket/download",
  authenticateToken,
  controllers.downloadDaftarKamar
);

router.get(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID Kamar tidak valid.")],
  controllers.getKamarById
);

// RUTE BARU: Memperbarui data satu kamar berdasarkan ID
router.put(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID Kamar tidak valid."),
    ...validation.createKamar,
  ],
  controllers.updateKamarById
);

router.delete(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID Kamar tidak valid.")],
  controllers.deleteKamarById
);

module.exports = router;
