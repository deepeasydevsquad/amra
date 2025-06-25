const { body } = require("express-validator");

const validation = {};

validation.createKamar = [
  // Memeriksa 'hotel_id'
  body("hotel_id")
    .notEmpty()
    .withMessage("Nama Hotel harus dipilih.")
    .isInt()
    .withMessage("ID Hotel tidak valid."),

  // Memeriksa 'tipe_kamar'
  body("tipe_kamar")
    .notEmpty()
    .withMessage("Tipe Kamar harus dipilih.")
    .isIn(["Laki-Laki", "Perempuan"])
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
];

module.exports = validation;
