const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/trans_transport/controllers/index");

router.post(
  "/trans_transport/add_transaksi",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("Nama wajib diisi"),
    body("identity_number")
      .notEmpty()
      .withMessage("Nomor identitas wajib diisi"),
    body("address").notEmpty().withMessage("Alamat wajib diisi"),

    // Validasi array details wajib ada dan minimal 1
    body("details")
      .isArray({ min: 1 })
      .withMessage("Minimal 1 mobil harus diinput"),

    // Loop validasi tiap item di array details[]
    body("details.*.mst_mobil_id")
      .notEmpty()
      .withMessage("Mobil wajib dipilih"),
    body("details.*.car_number")
      .notEmpty()
      .withMessage("Nomor mobil wajib diisi"),
    body("details.*.price").isNumeric().withMessage("Harga harus berupa angka"),
  ],
  controllers.add_transaksi_transport
);

router.post(
  "/trans_transport/delete_transaksi",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID  tidak boleh kosong.")],
  controllers.hapus_transaksi_transport
);

router.post(
  "/trans_transport/daftar_transaksi",
  authenticateToken,
  controllers.daftar_transaksi_transport
);

router.get(
  "/trans_transport/daftar_mobil",
  authenticateToken,
  controllers.daftar_mobil
);

module.exports = router;
