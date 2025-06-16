const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/pembayaran_fee_agen/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/pembayaran_fee_agen/daftar_fee_by_id",
  authenticateToken,
  [
    body("agen_id")
      .trim()
      .notEmpty()
      .withMessage("Agen ID tidak boleh kosong."),
  ],
  controllers.get_data_fee
);

router.post(
  "/pembayaran_fee_agen/daftar_pembayaran_fee_agen",
  authenticateToken,
  controllers.daftar_pembayaran_fee_agen
);

router.post(
  "/pembayaran_fee_agen/detail_pembayaran_fee",
  [
    body("id_pembayaran")
      .trim()
      .notEmpty()
      .withMessage("ID Pembayaran tidak boleh kosong."),
  ],
  authenticateToken,
  controllers.detail_pembayaran_fee
);

router.get(
  "/pembayaran_fee_agen/data_agen",
  authenticateToken,
  controllers.data_agen
);

router.post(
  "/pembayaran_fee_agen/add_pembayaran_fee",
  authenticateToken,
  [
    body("agen_id").notEmpty().withMessage("Agen ID wajib diisi."),

    body("aplicant_name")
      .notEmpty()
      .withMessage("Nama pemohon wajib diisi.")
      .isString()
      .withMessage("Nama pemohon harus berupa teks."),

    body("applicant_identity")
      .notEmpty()
      .withMessage("Identitas pemohon wajib diisi.")
      .isString()
      .withMessage("Identitas harus berupa teks."),

    body("fee_agen_id")
      .isArray({ min: 1 })
      .withMessage("fee_agen_id harus berupa array dan minimal 1 item."),

    body("nominal")
      .notEmpty()
      .withMessage("Nominal pembayaran wajib diisi.")
      .isNumeric()
      .withMessage("Nominal harus berupa angka."),
  ],
  controllers.add_pembayaran_agen
);

module.exports = router;
