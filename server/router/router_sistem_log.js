const express = require("express");
const controllers = require("../modules/sistem_log/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/sistem_log", authenticateToken, controllers.get_sistem_log);

module.exports = router;
