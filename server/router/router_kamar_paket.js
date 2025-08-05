const express = require("express");
const { body, query, param } = require("express-validator");
const controllers = require("../modules/kamar_paket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const validation = require("../validation/kamar_paket.js");

const router = express.Router();

// Rute untuk mengambil list data
router.post(
  "/daftar-kamar-paket/get-kamar-paket/list",
  authenticateToken,
  [
    body("paketId")
      .trim()
      .notEmpty().withMessage("ID paket tidak boleh kosong.")
      .isInt().withMessage("ID paket harus berupa angka.")
      .custom(validation.check_id_paket),
    body("division_id")
      .trim()
      .notEmpty().withMessage("ID Cabang tidak boleh kosong.")
      .isInt().withMessage("ID Cabang harus berupa angka.")
      .custom(validation.check_id_cabang),
    body("pageNumber").trim(),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.getDaftarKamarPaket
);

// Rute untuk membuat kamar baru
router.post(
  "/daftar-kamar-paket/create-kamar",
  authenticateToken,
  [
    body("hotel_id")
      .notEmpty()
      .withMessage("Nama Hotel harus dipilih.")
      .isInt()
      .withMessage("ID Hotel tidak valid."),

    body("division_id")
      .trim()
      .notEmpty()
      .withMessage("ID Divisi tidak boleh kosong.")
      .isInt()
      .withMessage("ID Divisi harus berupa angka.")
      .custom(validation.check_id_cabang),
    body("tipe_kamar")
      .notEmpty()
      .withMessage("Tipe Kamar harus dipilih.")
      .isIn(["laki_laki", "perempuan"])
      .withMessage("Tipe Kamar tidak valid."),
    body("kapasitas_kamar")
      .notEmpty()
      .withMessage("Kapasitas Kamar tidak boleh kosong.")
      .isInt({ min: 1 })
      .withMessage("Kapasitas harus berupa angka dan minimal 1."),
    body("jamaah_ids")
      .isArray()
      .withMessage("Data jamaah tidak valid.")
      .custom((value, { req }) => {
        if (value.length > 0 && value.length > req.body.kapasitas_kamar) {
          throw new Error("Jumlah jamaah tidak boleh melebihi kapasitas kamar.");
        }
        return true;
      }),
  ],
  controllers.createKamarPaket
);

// Rute untuk mengambil data hotel (untuk form dropdown)
router.post(
  "/daftar-kamar-paket/get-hotels",
  authenticateToken,
  [
    body("division_id")
      .trim()
      .notEmpty().withMessage("ID Cabang tidak boleh kosong.")
      .isInt().withMessage("ID Cabang harus berupa angka.")
      .custom(validation.check_id_cabang),
  ],
  controllers.getHotelsForForm
);

// Rute untuk mengambil data jamaah yang tersedia (untuk form dropdown)
router.post(
  "/daftar-kamar-paket/get-available-jamaah",
  authenticateToken,
  [
    body("paket_id")
      .trim()
      .notEmpty().withMessage("ID paket tidak boleh kosong.")
      .isInt().withMessage("ID paket harus berupa angka.")
      .custom(validation.check_id_paket),
    body("division_id")
      .isInt()
      .withMessage("Parameter cabangId harus berupa angka")
      .custom(validation.check_id_cabang),
  ],
  controllers.getAvailableJamaahForForm
);

router.post(
  "/daftar-kamar-paket/get-available-jamaah-for-edit",
  authenticateToken,
  [
    body("division_id")
      .isInt()
      .withMessage("Parameter cabangId harus berupa angka")
      .custom(validation.check_id_cabang),
    body("kamar_id")
      .isInt()
      .withMessage("Parameter kamar_id harus berupa angka")
      .custom(validation.check_id_kamar),
  ],
  controllers.getAvailableJamaahForFormEdit
)

// PERBAIKAN: Route download harus sebelum route dengan parameter :id
router.get(
  "/daftar-kamar-paket/download",
  authenticateToken,
  controllers.downloadDaftarKamar
);

router.get(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID Kamar tidak valid.").custom(validation.check_id_kamar),
  ],
  controllers.getKamarById
);

// RUTE BARU: Memperbarui data satu kamar berdasarkan ID
router.post(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID Kamar tidak valid."),
    // Memeriksa 'hotel_id'
    body("hotel_id")
      .notEmpty()
      .withMessage("Nama Hotel harus dipilih.")
      .isInt()
      .withMessage("ID Hotel tidak valid."),

    body("division_id")
      .trim()
      .notEmpty()
      .withMessage("ID Divisi tidak boleh kosong.")
      .isInt()
      .withMessage("ID Divisi harus berupa angka.")
      .custom(validation.check_id_cabang),

    // Memeriksa 'tipe_kamar'
    body("tipe_kamar")
      .notEmpty()
      .withMessage("Tipe Kamar harus dipilih.")
      .isIn(["laki_laki", "perempuan"])
      .withMessage("Tipe Kamar tidak valid."),

    // Memeriksa 'kapasitas_kamar'
    body("kapasitas_kamar")
      .notEmpty()
      .withMessage("Kapasitas Kamar tidak boleh kosong.")
      .isInt({ min: 1 })
      .withMessage("Kapasitas harus berupa angka dan minimal 1."),

    // Memeriksa 'jamaah_ids'
    body("jamaah_ids")
      .isArray()
      .withMessage("Data jamaah tidak valid.")
      .custom((value, { req }) => {
        if (value.length > 0 && value.length > req.body.kapasitas_kamar) {
          throw new Error("Jumlah jamaah tidak boleh melebihi kapasitas kamar.");
        }
        return true;
      }),
  ],
  controllers.updateKamarById
);

router.delete(
  "/daftar-kamar-paket/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID Kamar tidak valid.")],
  controllers.deleteKamarById
);

module.exports = router;
