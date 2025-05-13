const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/tabungan_umrah/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/tabungan_umrah");

const router = express.Router();

router.get("/get-Jamaah-Tabungan-Umrah/list", authenticateToken, controllers.getJamaahTabunganUmrah);
router.get("/get-Paket-Tabungan-Umrah/list", authenticateToken, controllers.getPaketTabunganUmrah);
router.post(
  "/get-Agen-Tabungan-Umrah",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID tidak boleh kosong.")],
  controllers.getAgenById
);

router.post(
  "/daftar_tabungan_umrah/list",
  authenticateToken,
  [
    body("pageNumber").trim(),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
    body("filter").trim(),
  ],
  controllers.get_daftar_tabungan_umrah
);

router.post(
  "/daftar_tabungan_umrah",
  authenticateToken,
  [
    body("jamaah_id")
      .trim()
      .notEmpty().withMessage("ID Jamaah tidak boleh kosong.")
      .isInt().withMessage("ID Jamaah harus berupa angka.")
      .custom(validation.check_id_jamaah),
    body("target_id")
      .trim()
      .notEmpty().withMessage("Target ID tidak boleh kosong.")
      .isInt().withMessage("Target ID harus berupa angka.")
      .custom(validation.check_id_target_paket),
    body("sumber_dana")
      .trim()
      .notEmpty().withMessage("Sumber Dana tidak boleh kosong."),
    body("biaya_deposit")
      .trim()
      .notEmpty().withMessage("Biaya Deposit tidak boleh kosong.")
      .isNumeric().withMessage("Biaya Deposit harus berupa angka.")
      .custom(validation.check_saldo_deposit_dan_nominal_tabungan),
    body("info_deposit")
      .trim(),
  ],
  controllers.add
);

router.post(
  "/daftar_tabungan_umrah/delete",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Paket tidak boleh kosong.").isInt().withMessage("ID Paket harus berupa angka."),
  ],
  controllers.delete
);

module.exports = router;



