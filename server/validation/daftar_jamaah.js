const { body } = require("express-validator");
const moment = require("moment");

// Validator untuk tambah jamaah
const tambahJamaahValidator = [
  body("fullname").notEmpty().withMessage("Fullname wajib diisi"),
  body("identity_number").notEmpty().withMessage("Nomor identitas wajib diisi"),
  body("identity_type").notEmpty().withMessage("Tipe identitas wajib diisi"),
  body("gender").notEmpty().withMessage("Jenis kelamin wajib diisi"),
  body("birth_place").notEmpty().withMessage("Tempat lahir wajib diisi"),
  body("birth_date")
    .notEmpty()
    .withMessage("Tanggal lahir wajib diisi")
    .custom((val) => moment(val, "YYYY-MM-DD", true).isValid())
    .withMessage("Tanggal lahir harus format tanggal"),
  body("whatsapp_number").notEmpty().withMessage("Nomor WhatsApp wajib diisi"),
  body("passwords").if(body("MemberId").not().exists()).notEmpty().withMessage("Password wajib jika tidak ada MemberId"),
  body("kelurahan_id").notEmpty().withMessage("Kelurahan wajib diisi"),
  body("title").notEmpty().withMessage("Title wajib diisi"),
  body("nama_ayah").notEmpty().withMessage("Nama ayah wajib diisi"),
  body("nama_passport").optional(),
  body("nomor_passport").optional(),
  body("tanggal_di_keluarkan_passport").optional().custom((val) => moment(val, "YYYY-MM-DD HH:mm:ss", true).isValid()).withMessage("Tanggal passport harus format tanggal"),
  body("tempat_di_keluarkan_passport").optional(),
  body("masa_berlaku_passport").optional().custom((val) => moment(val, "YYYY-MM-DD HH:mm:ss", true).isValid()).withMessage("Masa berlaku passport harus format tanggal"),
  body("kode_pos").optional(),
  body("nomor_telephone").optional(),
  body("pengalaman_haji").optional().isInt(),
  body("tahun_haji").optional(),
  body("pengalaman_umrah").optional().isInt(),
  body("tahun_umrah").optional(),
  body("desease").optional(),
  body("last_education").optional(),
  body("blood_type").optional(),
  body("photo_4_6").optional(),
  body("photo_3_4").optional(),
  body("fc_passport").optional(),
  body("mst_pekerjaan_id").optional(),
  body("profession_instantion_name").optional(),
  body("profession_instantion_address").optional(),
  body("profession_instantion_telephone").optional(),
  body("fc_kk").optional(),
  body("fc_ktp").optional(),
  body("buku_nikah").optional(),
  body("akte_lahir").optional(),
  body("buku_kuning").optional(),
  body("keterangan").optional(),
  body("nama_keluarga").optional(),
  body("alamat_keluarga").optional(),
  body("telephone_keluarga").optional(),
  body("status_nikah").optional(),
  body("tanggal_nikah")
    .optional()
    .custom((val) => moment(val, "YYYY-MM-DD", true).isValid())
    .withMessage("Tanggal nikah harus format tanggal"),
  body("kewarganegaraan").optional(),
];

// Validator untuk update jamaah
const updateJamaahValidator = [
  body("id").notEmpty().withMessage("ID jamaah wajib diisi"),
  body("fullname").optional(),
  body("identity_number").optional(),
  body("identity_type").optional(),
  body("gender").optional(),
  body("birth_place").optional(),
  body("birth_date")
    .optional()
    .custom((val) => moment(val, "YYYY-MM-DD", true).isValid())
    .withMessage("Tanggal lahir harus format tanggal"),
  body("whatsapp_number").optional(),
  body("kelurahan_id").optional(),
  body("title").optional(),
  body("nama_ayah").optional(),
  body("nama_passport").optional(),
  body("nomor_passport").optional(),
  body("tanggal_di_keluarkan_passport")
    .optional()
    .custom((val) => moment(val, "YYYY-MM-DD HH:mm:ss", true).isValid())
    .withMessage("Tanggal passport harus format tanggal"),
  body("tempat_di_keluarkan_passport").optional(),
  body("masa_berlaku_passport")
    .optional()
    .custom((val) => moment(val, "YYYY-MM-DD HH:mm:ss", true).isValid())
    .withMessage("Masa berlaku passport harus format tanggal"),
  body("kode_pos").optional(),
  body("nomor_telephone").optional(),
  body("pengalaman_haji").optional().isInt(),
  body("tahun_haji").optional(),
  body("pengalaman_umrah").optional().isInt(),
  body("tahun_umrah").optional(),
  body("desease").optional(),
  body("last_education").optional(),
  body("blood_type").optional(),
  body("photo_4_6").optional(),
  body("photo_3_4").optional(),
  body("fc_passport").optional(),
  body("mst_pekerjaan_id").optional(),
  body("profession_instantion_name").optional(),
  body("profession_instantion_address").optional(),
  body("profession_instantion_telephone").optional(),
  body("fc_kk").optional(),
  body("fc_ktp").optional(),
  body("buku_nikah").optional(),
  body("akte_lahir").optional(),
  body("buku_kuning").optional(),
  body("keterangan").optional(),
  body("nama_keluarga").optional(),
  body("alamat_keluarga").optional(),
  body("telephone_keluarga").optional(),
  body("status_nikah").optional(),
  body("tanggal_nikah")
    .optional()
    .custom((val) => moment(val, "YYYY-MM-DD", true).isValid())
    .withMessage("Tanggal nikah harus format tanggal"),
  body("kewarganegaraan").optional(),
];

module.exports = { tambahJamaahValidator, updateJamaahValidator };
