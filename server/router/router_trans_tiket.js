const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/trans_tiket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/add_tiket", authenticateToken, controllers.addTiket);
router.get("/ticket_transactions", authenticateToken, controllers.getTicketTransactions);

module.exports = router;