const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/trans_paket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/daftar-trans-paket/daftar-paket/list", 
  authenticateToken, 
  controllers.getPaketList
);

module.exports = router;
