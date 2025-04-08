const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/deposit_saldo/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/get-deposit", 
    [
        body("pageNumber").trim(),
        body("perpage").trim(),
        body("search").trim(),
    ], 
    authenticateToken, 
    controller.getDeposit
);

// router.get("/get-company", 
//     authenticateToken, 
//     controller.getCompany
// );

router.post("/add-deposit", 
    authenticateToken, 
    controller.addDeposit
);

router.post("/info-deposit", 
    authenticateToken, 
    controller.infoDeposit
);

module.exports = router;
