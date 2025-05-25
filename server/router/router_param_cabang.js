const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/param_cabang/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/investor");

const router = express.Router();

router.get(
  "/Param-cabang",
  authenticateToken,
  controllers.paramCabang
);

module.exports = router;
