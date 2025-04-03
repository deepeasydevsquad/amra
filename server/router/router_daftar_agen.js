const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/daftar_agen/controllers/index");
const router = express.Router();

router.get("/getAgen", authenticateToken, controllers.getAgen);
router.post("/addAgen", authenticateToken, controllers.addAgen);
// router.put("/edit-pengguna", authenticateToken, controllers.editPengguna);
router.post("/deleteAgen", authenticateToken, controllers.deleteAgen);

module.exports = router;
