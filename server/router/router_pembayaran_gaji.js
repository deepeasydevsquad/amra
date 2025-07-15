const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/pembayaran_gaji/controller/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/pembayaran_gaji/daftar_pembayaran_gaji",
  authenticateToken,
  [
    body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong."),
    body("pageNumber")
      .trim()
      .notEmpty()
      .withMessage("Page Number tidak boleh kosong."),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.daftar_pembayaran_gaji
);

router.post("/pembayaran_gaji/add_pembayaran", authenticateToken, [
  body("nominal").trim().notEmpty().withMessage("Nominal tidak boleh kosong."),
  body("division_id")
    .trim()
    .notEmpty()
    .withMessage("Divisi tidak boleh kosong."),
  body("user_id").trim().notEmpty().withMessage("User tidak boleh kosong."),
  controllers.add_pembayaran,
]);

router.post(
  "/pembayaran_gaji/daftar_staff",
  authenticateToken,
  [
    body("division_id")
      .trim()
      .notEmpty()
      .withMessage("Divisi tidak boleh kosong."),
  ],
  controllers.daftar_staff
);

router.post(
  "/pembayaran_gaji/delete_pembayaran",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("Id tidak boleh kosong.")],
  controllers.delete_pembayaran
);

module.exports = router;
