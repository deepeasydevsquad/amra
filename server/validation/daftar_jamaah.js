const { validationResult } = require("express-validator")
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  Op,
  Jamaah,
  Member,
  Division,
} = require("../models");
const { getCompanyIdByCode, tipe, getCabang } = require("../helper/companyHelper");


const getDivisionId = async (req) => {
  const userType = await tipe(req);
  console.log("User tipe: ", userType);
  if (userType === "administrator") {
      return req.body.division_id;
  } else if (userType === "staff") {
      const token = this.req.headers["authorization"]?.split(" ")[1];
      const decoded = token ? jwt.decode(token) : null;
      return decoded?.division_id; 
  } else {
      throw new Error("Role pengguna tidak valid.");
  }
}

    
const validation = {};

validation.removeUploadedFileOnValidationError = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    if (req.file) {
      const filePath = path.resolve(req.file.path)
      fs.unlink(filePath, (err) => {
        if (err) console.error("❌ Gagal menghapus file:", err)
        else console.log("🧹 File dihapus karena validasi gagal:", filePath)
      })
    }

    return res.status(422).json({ errors: errors.array() })
  }

  next()
}

// Path upload
const uploadPath = path.join(__dirname, "../uploads/member");

// Pastikan folder uploads/member ada
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    req.body.photoPath = filename; // Simpan lokasi file di req.body.photo
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

validation.check_id_jamaah = async ( value, { req } ) => {
  const division_id = await getDivisionId(req);
  const check = await Jamaah.findOne({ where: { id: value, division_id: division_id } });
  if (!check) {
    throw new Error("ID Jamaah tidak terdaftar dipangkalan data");
  }
  return true;
}

validation.check_id_member = async ( value, { req } ) => {
  const division_id = await getDivisionId(req);
  const check = await Member.findOne({ where: { id: value, division_id: division_id } });
  if (!check) {
    throw new Error("ID Member tidak terdaftar dipangkalan data");
  }
  return true;
}

validation.check_id_cabang = async ( value, { req } ) => {
  const company_id = await getCompanyIdByCode(req);
  var check = await Division.findOne({where: { id : value, company_id : company_id }}); 
  if (!check) {
    throw new Error("ID Cabang ini tidak terdaftar dipangkalan data");
  }
  return true;
}

module.exports = validation; 