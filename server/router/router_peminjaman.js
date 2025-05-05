const express = require("express");
const controllers = require("../modules/peminjaman/controllers/index");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();

router.post(
  "/add-peminjaman",
  authenticateToken,
  [
    body("jamaah_id").notEmpty().withMessage("jamaah tidak boleh kosong."),
    body("nomimal").notEmpty().withMessage("nominal tidak boleh kosong."),
    body("tenor").notEmpty().withMessage("tenor tidak boleh kosong."),
  ],
  controllers.addPinjaman
);

router.post("/get-peminjaman", authenticateToken, controllers.daftarPinjaman);

module.exports = router;
