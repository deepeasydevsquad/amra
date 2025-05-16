const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../modules/invoice/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/invoice");

const router = express.Router();

// router.post("/get-deposit", 
//     [
//         body("pageNumber").trim(),
//         body("perpage").trim(),
//         body("search").trim(),
//     ], 
//     authenticateToken, 
//     controller.getDeposit
// );

router.post("/invoice/cek-kwitansi-tabungan-umrah",
    authenticateToken,
    [
        body("invoice").trim().notEmpty().withMessage("Invoice tidak boleh kosong."),
    ],
    controller.cek_kwitansi_tabungan_umrah
);

router.get("/invoice/invoice-deposit/:invoice", 
    authenticateToken,
    controller.invoice_deposit
);

router.get("/invoice/invoice-paket-la/:invoice",
    authenticateToken,
    controller.invoice_paket_la
)

router.get("/invoice/kwitansi-terakhir/:register_number",
    authenticateToken,
    controller.kwitansi_terakhir
)

router.get("/invoice/kwitansi-tabungan-umrah/:invoice",
    authenticateToken,
    controller.kwitansi_tabungan_umrah
)

// router.post("/add-deposit", 
//     authenticateToken, 
//     controller.addDeposit
// );

// router.post("/info-deposit", 
//     authenticateToken, 
//     controller.infoDeposit
// );

module.exports = router;
