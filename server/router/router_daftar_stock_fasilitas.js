const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_stock_fasilitas/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/daftar_provider_visa");

const router = express.Router();

router.post(
  "/daftar-stock-fasilitas/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.list
);

router.post(
  "/daftar-stock-fasilitas/add",
  authenticateToken,
  [
    body("jumlah")
      .notEmpty()
      .withMessage("Jumlah stok wajib diisi.")
      .isInt({ min: 1 })
      .withMessage("Jumlah stok harus berupa angka lebih dari 0."),
    body("mst_fasilitas_id")
      .notEmpty()
      .withMessage("ID fasilitas wajib diisi."),
    body("harga_beli")
      .notEmpty()
      .withMessage("Harga beli wajib diisi.")
      .isNumeric()
      .withMessage("Harga beli harus berupa angka."),
    body("harga_jual")
      .notEmpty()
      .withMessage("Harga jual wajib diisi.")
      .isNumeric()
      .withMessage("Harga jual harus berupa angka."),
  ],
  controllers.add_stock
);

module.exports = router;
