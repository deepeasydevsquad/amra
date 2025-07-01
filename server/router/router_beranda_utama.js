const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/beranda_utama/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
    "/beranda-utama/status-card",
    authenticateToken,
    controllers.statusCard
);

router.post(
    "/beranda-utama/daftar-jamaah",
    authenticateToken,
    [
        body("search").trim(),
        body("perpage").isInt().withMessage("Jumlah Per Page harus berupa angka."),
        body("pageNumber").isInt().withMessage("Page Number harus berupa angka.")
    ],
    controllers.daftarJamaah
);

// router.post(
//     "/beranda-utama/daftar-permintaan-deposit-member",
//     authenticateToken,
//     [
//         body("search").trim(),
//         body("perpage").isInt().withMessage("Jumlah Per Page harus berupa angka."),
//         body("pageNumber").isInt().withMessage("Page Number harus berupa angka.")
//     ],
//     controllers.daftarPermintaanDepositMember
// );

// router.post(
//     "/beranda-utama/daftar-headline",
//     authenticateToken,
//     [
//         body("search").trim(),
//         body("perpage").isInt().withMessage("Jumlah Per Page harus berupa angka."),
//         body("pageNumber").isInt().withMessage("Page Number harus berupa angka.")
//     ],
//     controllers.daftarHeadline || ((req, res, next) => next())
// );

module.exports = router;

