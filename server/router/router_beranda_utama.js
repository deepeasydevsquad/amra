const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/beranda_utama/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/beranda_utama");

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

router.post(
    "/beranda-utama/daftar-headline",
    authenticateToken,
    [
        body("perpage").isInt().withMessage("Jumlah Per Page harus berupa angka."),
        body("pageNumber").isInt().withMessage("Page Number harus berupa angka.")
    ],
    controllers.daftarHeadline
);

router.post(
    "/beranda-utama/delete-headline",
    authenticateToken,
    [
        body("id")
            .notEmpty().withMessage("ID Headline tidak boleh kosong.")
            .isInt().withMessage("ID Headline harus berupa angka.")
            .custom(validation.check_headline_id),
    ],
    controllers.deleteHeadline
);

module.exports = router;

