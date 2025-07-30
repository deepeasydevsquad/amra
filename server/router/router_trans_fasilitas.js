const express = require("express");
const { body, param, query } = require("express-validator");
const controllers = require("../modules/trans_fasilitas/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/trans_paket");

const router = express.Router();

router.post(
    "/trans_fasilitas/daftar_transaksi",
    authenticateToken,
    [
        body("perpage").optional().isInt().withMessage("Jumlah per halaman harus berupa angka."),
        body("pageNumber").optional().isInt().withMessage("Nomor halaman harus berupa angka."),
        body("search").optional().trim(),
    ],
    controllers.daftar_transaksi_fasilitas
);

module.exports = router;