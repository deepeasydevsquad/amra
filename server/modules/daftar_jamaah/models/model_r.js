const fs = require("fs");
const path = require("path");

const {
  Member,
  Agen,
  Jamaah,
  sequelize,
  Division,
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

}

module.exports = Model_r;
