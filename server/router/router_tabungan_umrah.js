const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/tabungan_umrah/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const validation = require("../validation/tabungan_umrah");

const router = express.Router();

router.get(
  "/daftar-tabungan-umrah/get-jamaah-tabungan-umrah/list",
  authenticateToken,
  controllers.getJamaahTabunganUmrah
);

router.get(
  "/daftar-tabungan-umrah/get-paket-tabungan-umrah/list",
  authenticateToken,
  controllers.getPaketTabunganUmrah
);

router.post(
  "/daftar-tabungan-umrah/get-mst-fasilitas/list",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
  ],
  controllers.getMstFasilitas
);

router.post(
  "/daftar-tabungan-umrah/get-agen-tabungan-umrah",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID tidak boleh kosong.")],
  controllers.getAgenById
);

router.post(
  "/daftar-tabungan-umrah/get-handover-fasilitas",
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
  ],
  authenticateToken,
  controllers.getHandoverFasilitasById
);

router.post(
  "/daftar-tabungan-umrah/get-tabungan-umrah/list",
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
  "/daftar-tabungan-umrah/add-tabungan-umrah",
  authenticateToken,
  [
    body("jamaah_id")
      .trim()
      .notEmpty().withMessage("ID Jamaah tidak boleh kosong.")
      .isInt().withMessage("ID Jamaah harus berupa angka.")
      .custom(validation.check_id_jamaah),
    body("target_id")
      .trim()
      .optional({ checkFalsy: true })
      .isInt().withMessage("Target ID harus berupa angka.")
      .custom(validation.check_id_target_paket),
    body("sumber_dana")
      .trim()
      .notEmpty().withMessage("Sumber Dana tidak boleh kosong.")
      .custom(validation.check_sumber_dana),
    body("biaya_deposit")
      .trim()
      .notEmpty().withMessage("Biaya Deposit tidak boleh kosong.")
      .isNumeric().withMessage("Biaya Deposit harus berupa angka.")
      .custom(validation.check_saldo_deposit_dan_biaya),
    body("info_deposit")
      .trim(),
  ],
  controllers.add
);

router.post(
  "/daftar-tabungan-umrah/update-target-paket-tabungan-umrah",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty()
      .withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt()
      .withMessage("ID Tabungan Umrah harus berupa angka."),
    body("target_id")
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .isInt().withMessage("Target ID harus berupa angka.")
      .custom(validation.check_id_target_paket),
  ],
  controllers.updateTargetPaket
)

router.post(
  "/daftar-tabungan-umrah/menabung-tabungan-umrah",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
    body("sumber_dana")
      .trim()
      .notEmpty().withMessage("Sumber Dana tidak boleh kosong.")
      .custom(validation.check_sumber_dana),
    body("biaya_deposit")
      .trim()
      .notEmpty().withMessage("Biaya Deposit tidak boleh kosong.")
      .isNumeric().withMessage("Biaya Deposit harus berupa angka.")
      .custom(v => {
        if (Number(v) <= 0) throw new Error("Biaya deposit harus lebih dari 0.");
        return true;
      })
      .custom(validation.check_saldo_deposit_dan_biaya),
    body("info_deposit")
      .trim()
  ],
  controllers.Menabung
)

router.post(
  "/daftar-tabungan-umrah/refund-tabungan-umrah",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
    body("refund_nominal")
      .trim()
      .notEmpty().withMessage("Refund tidak boleh kosong.")
      .isNumeric().withMessage("Refund harus berupa angka.")
      .custom(v => {
        if (Number(v) <= 0) throw new Error("Nominal refund harus lebih dari 0.");
        return true;
      })
      .custom(validation.check_refund_nominal),
    body("batal_berangkat")
      .trim()
      .isBoolean().withMessage("Batal Berangkat harus berupa ya atau tidak."),
  ],
  controllers.Refund
)

router.post(
  "/daftar-tabungan-umrah/add-handover-fasilitas",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
    body("penerima")
      .trim()
      .notEmpty().withMessage("Nama Penerima tidak boleh kosong.")
      .toUpperCase(),
    body("nomor_identitas_penerima")
      .trim()
      .notEmpty().withMessage("Nomor Identitas Penerima tidak boleh kosong.")
      .isNumeric().withMessage("Nomor Identitas Penerima harus berupa angka."),
    body("detail_fasilitas")
      .isArray({ min: 1 })
      .withMessage("Fasilitas paket tidak boleh kosong.")
      .custom(validation.check_mst_paket)
  ],
  controllers.addHandoverFasilitas
);

router.post(
  "/daftar-tabungan-umrah/delete-tabungan-umrah",
  authenticateToken,
  [
    body("id")
      .trim()
      .notEmpty().withMessage("ID Tabungan Umrah tidak boleh kosong.")
      .isInt().withMessage("ID Tabungan Umrah harus berupa angka.")
      .custom(validation.check_id_tabungan),
  ],
  controllers.delete
);

module.exports = router;
