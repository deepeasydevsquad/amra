const fs = require("fs");
const path = require("path");
const ExcelJS = require('exceljs');

const {
  Member,
  Agen,
  Jamaah,
  sequelize,
  Division,
  Mst_pekerjaan,
  Mst_pendidikan
} = require("../../../models");
const { Op } = require("sequelize");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    console.log("company_id =>", this.company_id);
  }

  async daftar_jamaah() {
  const body = this.req.body;
  const limit = body.perpage || 10;
  const page =
    body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

  let where = {};

  if (body.division_id) {
    where.division_id = body.division_id;
  }

  if (body.search) {
    where = {
      ...where,
      [Op.or]: [
        { fullname: { [Op.like]: `%${body.search}%` } },
        { identity_number: { [Op.like]: `%${body.search}%` } },
      ],
    };
  }

  const sql = {
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    order: [["id", "ASC"]],
    where: where,
    attributes: ["nomor_passport",// Menambahkan whatsapp_number dari Jamaah
          "nama_ayah",
          "nama_passport",
          "tanggal_di_keluarkan_passport",
          "tempat_di_keluarkan_passport",
          "masa_berlaku_passport",
          "kode_pos",
          "nomor_telephone",
          "pengalaman_haji",
          "tahun_haji",
          "pengalaman_umrah",
          "tahun_umrah",
          "desease",
          "last_education",
          "blood_type",
          "photo_4_6",
          "photo_3_4",
          "fc_passport",
          "mst_pekerjaan_id",
          "profession_instantion_name",
          "profession_instantion_address",
          "profession_instantion_telephone",
          "fc_kk",
          "fc_ktp",
          "buku_nikah",
          "akte_lahir",
          "buku_kuning",
          "keterangan",
          "nama_keluarga",
          "alamat_keluarga",
          "telephone_keluarga",
          "status_nikah",
          "tanggal_nikah",
          "kewarganegaraan",
          "title",], // Ambil nomor_passport dari Jamaah
    include: [
      {
        model: Member, // Menyertakan data Member yang terkait dengan Jamaah
        attributes: [
          "id",
          "fullname",
          "identity_type",
          "gender",
          "photo",
          "identity_number",
          "birth_place",
          "birth_date",
          "whatsapp_number", // Menambahkan whatsapp_number dari Member
        ],
      },
      {
        model: Agen, // Menyertakan data Agen yang terkait dengan Member
        attributes: ["member_id"], // Ambil member_id dari Agen
        include: [
          {
            model: Member, // Menyertakan data Member yang terkait dengan Agen
            attributes: ["fullname"], // Ambil fullname dari Member terkait Agen
          },
        ],
      },
    ],
  };

  try {
    const q = await Jamaah.findAndCountAll(sql); // Cari data dari Jamaah
    const total = q.count;
    let data = [];

    if (total > 0) {
      data = q.rows.map((jamaah) => {
        const member = jamaah.Member || {}; // Ambil Member terkait Jamaah
        const agen = jamaah.Agen || {}; // Ambil Agen terkait Jamaah
        const agenMember = agen.Member || {}; // Ambil Member terkait Agen

        return {
          id: member.id,
          nama_jamaah: member.fullname ,
          birth_place:member.birth_place,
          birth_date: member.birth_date, // Ambil fullname dari Member yang terkait dengan Jamaah
          nama_agen: agenMember.fullname , // Ambil fullname agen dari Member yang terkait dengan Agen
          nomor_identitas: member.identity_number , // Ambil identity_number dari Member
          tempat_tanggal_lahir:
            member.birth_place && member.birth_date
              ? `${member.birth_place}, ${new Date(
                  member.birth_date
                ).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}`
              : "-",

          identity_type: member.identity_type,
          gender: member.gender ,
          photo: member.photo ,
          nomor_passport: jamaah.nomor_passport , // Ambil nomor_passport dari Jamaah
          whatsapp_number: member.whatsapp_number , // Ambil whatsapp_number dari Member

          // Data tambahan untuk jamaah
          title: jamaah.title,
          nama_ayah: jamaah.nama_ayah ,
          nama_passport: jamaah.nama_passport ,
          tanggal_di_keluarkan_passport: jamaah.tanggal_di_keluarkan_passport ,
          tempat_di_keluarkan_passport: jamaah.tempat_di_keluarkan_passport ,
          masa_berlaku_passport: jamaah.masa_berlaku_passport ,
          kode_pos: jamaah.kode_pos ,
          nomor_telephone: jamaah.nomor_telephone ,
          pengalaman_haji: jamaah.pengalaman_haji ,
          tahun_haji: jamaah.tahun_haji ,
          pengalaman_umrah: jamaah.pengalaman_umrah ,
          tahun_umrah: jamaah.tahun_umrah ,
          desease: jamaah.desease ,
          last_education: jamaah.last_education ,
          blood_type: jamaah.blood_type ,
          photo_4_6: jamaah.photo_4_6 ,
          photo_3_4: jamaah.photo_3_4 ,
          fc_passport: jamaah.fc_passport ,
          mst_pekerjaan_id: jamaah.mst_pekerjaan_id ,
          profession_instantion_name: jamaah.profession_instantion_name ,
          profession_instantion_address: jamaah.profession_instantion_address ,
          profession_instantion_telephone: jamaah.profession_instantion_telephone ,
          fc_kk: jamaah.fc_kk ,
          fc_ktp: jamaah.fc_ktp ,
          buku_nikah: jamaah.buku_nikah ,
          akte_lahir: jamaah.akte_lahir ,
          buku_kuning: jamaah.buku_kuning ,
          keterangan: jamaah.keterangan ,
          nama_keluarga: jamaah.nama_keluarga ,
          alamat_keluarga: jamaah.alamat_keluarga ,
          telephone_keluarga: jamaah.telephone_keluarga ,
          status_nikah: jamaah.status_nikah ,
          tanggal_nikah: jamaah.tanggal_nikah ,
          kewarganegaraan: jamaah.kewarganegaraan ,
        };
      });
    }

    return {
      data: data,
      total: total,
    };
  } catch (error) {
    console.error("ERROR: daftar_jamaah()", error);
    return { data: [], total: 0 };
  }
}


async download_jamaah() {
  const body = this.req.body;
  const limit = body.perpage || 10;
  const page =
    body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

  let where = {};

  if (body.division_id) {
    where.division_id = body.division_id;
  }

  if (body.search) {
    where = {
      ...where,
      [Op.or]: [
        { fullname: { [Op.like]: `%${body.search}%` } },
        { identity_number: { [Op.like]: `%${body.search}%` } },
      ],
    };
  }

  const sql = {
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    order: [["id", "ASC"]],
    where: where,
    attributes: [
      "nomor_passport",
      "nama_ayah",
      "nama_passport",
      "tanggal_di_keluarkan_passport",
      "tempat_di_keluarkan_passport",
      "masa_berlaku_passport",
      "nomor_telephone",
      "last_education", // bisa dihapus dari sini kalau ambil dari relasi
      "mst_pekerjaan_id", // sama juga
      "telephone_keluarga",
      "status_nikah",
      "kewarganegaraan",
      "title",
    ],
    include: [
      {
        model: Member,
        attributes: [
          "fullname",
          "identity_number",
          "identity_type",
          "birth_date",
          "birth_place",
        ],
      },
      {
        model: Mst_pekerjaan, 
  
        attributes: ["name"], 
      },
      {
        model: Mst_pendidikan, 
        attributes: ["name"],
      },
    ],
  };
  try {
    const q = await Jamaah.findAndCountAll(sql); // Cari data dari Jamaah
    const total = q.count;
    let data = [];

    if (total > 0) {
      data = q.rows.map((jamaah) => {
        const member = jamaah.Member || {};
        const pekerjaan = jamaah.Mst_pekerjaan || {};
        const pendidikan = jamaah.Mst_pendidikan || {};
    
        return {
          nama_jamaah: member.fullname || "-",
          nomor_identitas: member.identity_number || "-",
          jenis_identitas: member.identity_type || "-",
          tempat_lahir: member.birth_place || "-",
          tanggal_lahir: member.birth_date
            ? new Date(member.birth_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-",
    
          nomor_passport: jamaah.nomor_passport || "-",
          nama_passport: jamaah.nama_passport || "-",
          nama_ayah: jamaah.nama_ayah || "-",
          tanggal_dikeluarkan_passport: jamaah.tanggal_di_keluarkan_passport || "-",
          tempat_dikeluarkan_passport: jamaah.tempat_di_keluarkan_passport || "-",
          masa_berlaku_passport: jamaah.masa_berlaku_passport || "-",
          nomor_telephone: jamaah.nomor_telephone || "-",
          telephone_keluarga: jamaah.telephone_keluarga || "-",
          status_nikah: jamaah.status_nikah || "-",
          kewarganegaraan: jamaah.kewarganegaraan || "-",
          title: jamaah.title || "-",
    
          nama_pekerjaan: pekerjaan.name || "-",
          nama_pendidikan: pendidikan.name || "-",
        };
      });
    }
    return {
      data: data,
      total: total,
    };
  } catch (error) {
    console.error("ERROR: daftar_jamaah()", error);
    return { data: [], total: 0 };
  }
}


async exportToExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Jamaah");

  // Define kolom header
  worksheet.columns = [
    { header: "Nama Jamaah", key: "nama_jamaah", width: 25 },
    { header: "Nomor Identitas", key: "nomor_identitas", width: 20 },
    { header: "Jenis Identitas", key: "jenis_identitas", width: 15 },
    { header: "Tempat Lahir", key: "tempat_lahir", width: 20 },
    { header: "Tanggal Lahir", key: "tanggal_lahir", width: 20 },

    { header: "Nomor Passport", key: "nomor_passport", width: 20 },
    { header: "Nama Passport", key: "nama_passport", width: 25 },
    { header: "Nama Ayah", key: "nama_ayah", width: 25 },
    { header: "Tanggal Dikeluarkan Passport", key: "tanggal_dikeluarkan_passport", width: 25 },
    { header: "Tempat Dikeluarkan Passport", key: "tempat_dikeluarkan_passport", width: 25 },
    { header: "Masa Berlaku Passport", key: "masa_berlaku_passport", width: 25 },

    { header: "Nomor Telephone", key: "nomor_telephone", width: 20 },
    { header: "Telephone Keluarga", key: "telephone_keluarga", width: 20 },
    { header: "Status Nikah", key: "status_nikah", width: 15 },
    { header: "Kewarganegaraan", key: "kewarganegaraan", width: 15 },
    { header: "Title", key: "title", width: 10 },

    { header: "Pekerjaan", key: "nama_pekerjaan", width: 25 },
    { header: "Pendidikan Terakhir", key: "nama_pendidikan", width: 25 },
  ];

  // Tambahkan data ke worksheet
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Format header biar tebal
  worksheet.getRow(1).font = { bold: true };

  // Simpan workbook ke buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Kembalikan buffer buat response express
  return buffer;
}
async download_jamaah_excel(req, res) {
  await this.initialize();

  const result = await this.download_jamaah();
  const buffer = await this.exportToExcel(result.data);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=Data_Jamaah.xlsx");

  res.send(buffer);
}



}

module.exports = Model_r;
