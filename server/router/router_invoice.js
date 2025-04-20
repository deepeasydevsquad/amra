const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/invoice/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

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

// router.post("/add-deposit", 
//     authenticateToken, 
//     controller.addDeposit
// );

// router.post("/info-deposit", 
//     authenticateToken, 
//     controller.infoDeposit
// );

module.exports = router;
