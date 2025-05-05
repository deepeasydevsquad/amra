const { Paket_la } = require("../models");
const { getCabang } = require("../helper/companyHelper");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const validation = {};

// Path upload
const uploadPath = path.join(__dirname, "../uploads/daftar_paket");

// Pastikan folder uploads/member ada
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    req.body.photoPath = `/uploads/daftar_paket/${filename}`; // Simpan lokasi file di req.body.photo
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus PNG, JPG atau JPEG"), false);
  }
};

validation.upload = multer({ storage, fileFilter });

// Validasi ID paket
validation.check_id_paket_la = async (value, { req }) => {
  console.log("Mengecek ID Paket LA:", value); // Log ID yang akan diperiksa
  const division_id = await getCabang(req);
  console.log("Division ID:", division_id); // Log division_id

  const check = await Paket_la.findOne({ where: { id: value, division_id } });

  if (!check) {
    console.log("ID Paket LA tidak ditemukan di database"); // Log jika ID tidak ditemukan
    throw new Error("ID Paket LA tidak terdaftar di pangkalan data");
  }

  console.log("ID Paket LA ditemukan:", check); // Log jika ID ditemukan
};

module.exports = validation;
