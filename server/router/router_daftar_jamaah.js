const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/daftar_jamaah/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/get-daftar-jamaah",
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getJamaah
);

router.post("/add-daftar-jamaah", 
  authenticateToken, 
  
  controller.addJamaah);


router.post("/edit-daftar-jamaah", authenticateToken, controller.editJamaah);
router.post(
  "/delete-daftar-jamaah",
  authenticateToken,
  controller.deleteJamaah
);

module.exports = router;
