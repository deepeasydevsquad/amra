const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { hotelTransactionValidator } = require("../validation/transaksi_hotel");
const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/trans_hotel/controllers/index");

router.post(
  "/trans_hotel/add_transaksi",
  authenticateToken,
  hotelTransactionValidator, // <- ini harus array
  controllers.add_transaksi_hotel
);

router.post(
  "/trans_hotel/delete_transaksi",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID  tidak boleh kosong.")],
  controllers.hapus_transaksi_hotel
);

router.post(
  "/trans_hotel/daftar_transaksi",
  authenticateToken,
  controllers.daftar_transaksi_hotel
);

router.get(
  "/trans_hotel/daftar_kota",
  authenticateToken,
  controllers.daftar_kota
);
router.get(
  "/trans_hotel/daftar_hotel",
  authenticateToken,
  controllers.daftar_hotel
);

module.exports = router;
