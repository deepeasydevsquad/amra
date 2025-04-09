const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/invoice_paket_la/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/invoice_paket_la");

const router = express.Router();

router.post(
  "/invoice_paket_la",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty()
      .withMessage("ID Paket LA tidak boleh kosong.")
      .isInt()
      .withMessage("ID Paket LA harus berupa angka.")
      .custom(validation.check_id_paket_la),

    body("fasilitaspaketlaId")
      .trim()
      .notEmpty()
      .withMessage("ID Fasilitas Paket LA tidak boleh kosong.")
      .isInt()
      .withMessage("ID Fasilitas Paket LA harus berupa angka.")
      .custom(validation.check_id_fasilitas_paket_la),
  ],
  controllers.get_invoice_paket_la
);

module.exports = router;
