const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/paket_agen/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/investor");

const router = express.Router();

router.post("/paket/agen", authenticateToken, controllers.daftar_agen);

module.exports = router;
