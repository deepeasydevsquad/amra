const express = require("express");
const { body, param, query } = require("express-validator");
const controllers = require("../modules/trans_paket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/trans_paket");

const router = express.Router();

router.get(
  "/daftar-trans-paket/daftar-paket/list", 
  authenticateToken, 
  controllers.getPaketListTransPaket
);

router.post(
  "/daftar-trans-paket/daftar-jamaah/list",
  authenticateToken,
  [
    body("pageNumber").trim().notEmpty().withMessage("Nomor halaman tidak boleh kosong."),
    body("perpage").trim().notEmpty().withMessage("Jumlah per halaman tidak boleh kosong.").isInt().withMessage("Jumlah per halaman harus berupa angka."),
    body("search").trim()
  ],
  controllers.getDaftarJamaahTransPaket
);

module.exports = router;
