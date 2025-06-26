const { body } = require("express-validator");

const validation = {};

validation.createBus = [
  // Memeriksa 'city_id'
  body("city_id")
    .notEmpty()
    .withMessage("Nama Kota harus dipilih.")
    .isInt()
    .withMessage("ID Kota tidak valid."),

  // Memeriksa 'bus_number'
  body("bus_number")
    .notEmpty()
    .withMessage("Nomor Bus tidak boleh kosong.")
    .isString()
    .withMessage("Nomor Bus harus berupa Plat Nomor."),

  // Memeriksa 'kapasitas_bus'
  body("kapasitas_bus")
    .notEmpty()
    .withMessage("Kapasitas bus tidak boleh kosong.")
    .isInt({ min: 1 })
    .withMessage("Kapasitas harus berupa angka dan minimal 1."),

  body("bus_leader")
    .notEmpty()
    .withMessage("Bus Leader tidak boleh kosong.")
    .isString()
    .withMessage("Bus Leader harus diisi."),

  // Memeriksa 'jamaah_ids'
  body("jamaah_ids")
    .isArray()
    .withMessage("Data jamaah tidak valid.")
    .custom((value, { req }) => {
      if (value.length > 0 && value.length > req.body.kapasitas_bus) {
        throw new Error("Jumlah jamaah tidak boleh melebihi kapasitas bus.");
      }
      return true;
    }),
];

module.exports = validation;
