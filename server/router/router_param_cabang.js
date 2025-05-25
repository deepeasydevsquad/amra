const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/param_cabang/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/investor");

const router = express.Router();

router.get("/Param-cabang",authenticateToken,controllers.paramCabang);
router.get("/Param-akun",authenticateToken,controllers.paramAkun);
router.get("/Param-periode",authenticateToken,controllers.paramPeriode);

module.exports = router;
