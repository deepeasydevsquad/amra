const express = require("express");
const controller = require("../modules/deposit_saldo/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/get-deposit", authenticateToken, controller.getDeposit);
router.get("/get-company", authenticateToken, controller.getCompany);
router.post("/add-deposit", authenticateToken, controller.addDeposit);
router.post("/info-deposit", authenticateToken, controller.infoDeposit);

module.exports = router;
