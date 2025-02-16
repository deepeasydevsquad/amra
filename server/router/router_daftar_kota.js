const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/daftar_kota/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

// ROUTER
const router = express.Router();

// GET: Mendapatkan daftar kota
router.get("/daftar_kota", authenticateToken, controllers.get_daftar_kota);

// POST: Menambah kota (Hanya jika user terautentikasi)
router.post(
  "/daftar_kota", authenticateToken,
  [
    body("company_id").isInt().withMessage("company_id harus berupa angka."),
    body("kode").trim().notEmpty().withMessage("Kode tidak boleh kosong."),
    body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
  ],
  controllers.create_daftar_kota
);

// PUT: Update kota berdasarkan ID
router.put(
  "/daftar_kota/:id", authenticateToken,
  [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("company_id").isInt().withMessage("company_id harus berupa angka."),
    body("kode").trim().notEmpty().withMessage("Kode tidak boleh kosong."),
    body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
  ],
  controllers.update_daftar_kota
);

// DELETE: Hapus kota berdasarkan ID
router.delete(
  "/daftar_kota/:id", authenticateToken,
  [
    param("id").isInt().withMessage("ID harus berupa angka."),
  ],
  controllers.delete_daftar_kota
);

module.exports = router;