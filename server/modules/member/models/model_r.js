const { Op, Member } = require("../../../models");
const { tipe } = require("../../../helper/companyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getTipe() {
    const type = await tipe(this.req);
    return type;
    console.log(type);
  }

  // Fungsi untuk mengambil daftar member dengan filter dan pagination
  async daftar_member() {
    const body = this.req.body;
    const limit = body.perpage || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

    let where = {};

    // Filter berdasarkan division_id jika ada
    if (body.division_id) {
      where.division_id = body.division_id;
    }

    // Filter berdasarkan pencarian (search)
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
      attributes: [
        "id",
        "fullname",
        "identity_number",
        "identity_type",
        "gender",
        "photo",
        "birth_place",
        "birth_date",
        "whatsapp_number",
        "createdAt",
        "updatedAt",
      ],
      where: where,
    };

    try {
      const q = await Member.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        // Ambil tipe dari token JWT
        const type = await tipe(this.req);

        data = q.rows.map((e) => ({
          id: e.id,
          fullname: e.fullname,
          identity_number: e.identity_number,
          identity_type: e.identity_type,
          gender: e.gender,
          photo: e.photo,
          birth_place: e.birth_place,
          birth_date: e.birth_date,
          whatsapp_number: e.whatsapp_number,
          tipe: type, // Sertakan tipe dalam respons
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        }));
      }

      return {
        data: data,
        total: total,
      };
    } catch (error) {
      console.error("ERROR: daftar_member()", error);
      return { data: [], total: 0 };
    }
  }
  // Fungsi untuk mengambil informasi detail member berdasarkan ID
  async infoMember(id, transaction = null) {
    try {
      // Cari member di database
      const member = await Member.findOne({
        where: { id: id },
        transaction: transaction, // Teruskan transaksi jika ada
      });

      // Jika member tidak ditemukan, kembalikan null
      if (!member) return null;

      // Ambil tipe dari token JWT
      const type = await tipe(this.req);

      // Kembalikan data member yang diperlukan
      return {
        id: member.id,
        fullname: member.fullname,
        identity_number: member.identity_number,
        identity_type: member.identity_type,
        gender: member.gender,
        photo: member.photo,
        birth_place: member.birth_place,
        birth_date: member.birth_date,
        whatsapp_number: member.whatsapp_number,
        tipe: type, // Sertakan tipe dalam respons
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    } catch (error) {
      // Log error dengan detail
      console.error("ERROR: infoMember()", {
        message: error.message,
        stack: error.stack,
        id: id,
      });

      // Lempar error kembali agar bisa ditangani oleh pemanggil
      throw new Error(`Gagal mengambil data member: ${error.message}`);
    }
  }

  // Fungsi untuk memeriksa apakah nomor identitas sudah terdaftar
  async isIdentityNumberExists(identity_number, identity_type) {
    try {
      const member = await Member.findOne({
        where: {
          identity_number: identity_number,
          identity_type: identity_type,
        },
      });
      return !!member; // Mengembalikan true jika ditemukan, false jika tidak
    } catch (error) {
      console.error("ERROR: isIdentityNumberExists()", error);
      return false;
    }
  }
}

module.exports = Model_r;
