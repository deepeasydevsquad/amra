const express = require("express");
const controllers = require("../modules/peminjaman/controllers/index");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();

console.log("controllers:", controllers);
console.log("update:", controllers.updateSkema);
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

router.post("/get-skema", authenticateToken, controllers.SkemaByID);

router.post(
  "/update-skema",
  authenticateToken,
  [
    body("peminjaman_id")
      .notEmpty()
      .withMessage("id peminjaman tidak boleh kosong."),
    body("id")
      .notEmpty()
      .withMessage("id skema peminjaman tidak boleh kosong."),
    body("nomimal")
      .notEmpty()
      .withMessage("nominal  skema peminjaman tidak boleh kosong."),
    body("term")
      .notEmpty()
      .withMessage("term skema peminjaman tidak boleh kosong."),
  ],
  controllers.updateSkema
);

router.post(
  "/bayar-perbulan",
  authenticateToken,
  [
    body("peminjaman_id")
      .notEmpty()
      .withMessage("id peminjaman tidak boleh kosong."),
    body("nominal").notEmpty().withMessage("nominal tidak boleh kosong."),
  ],
  controllers.pembayaranPerbulan
);

module.exports = router;
