const { sequelize, User, Member, Grup, Division } = require("../../../models");
const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const bcrypt = require("bcryptjs");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id = null;
    this.t = null;
    this.state = true;
    this.message = "";
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
  }

  // Tambah Pengguna
async tambahPengguna() {
  await this.initialize();
  const { member_id, grup_id, division_id } = this.req.body;
  const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

  console.log("req.body:", this.req.body);
  console.log("req.file:", this.req.file);

  try {
    // Konversi ID ke integer agar tidak error di database
    const divisionIdInt = parseInt(division_id, 10);
    const grupIdInt = parseInt(grup_id, 10);
    if (isNaN(divisionIdInt) || isNaN(grupIdInt)) {
      throw new Error("division_id atau grup_id harus berupa angka.");
    }

    const photo = this.req.file ? this.req.file.path : null;
    let memberId = member_id;

    if (memberId) {
      // Cek apakah member dengan ID tersebut ada di database
      const existingMember = await Member.findByPk(memberId);
      if (!existingMember) throw new Error("Member dengan ID tersebut tidak ditemukan");

      this.message = `Menambahkan user baru untuk member yang sudah ada: ${existingMember.fullname} (Member ID: ${memberId})`;
    } else {
      // Jika tidak ada member_id, ambil data member dari req.body langsung
      const {
        fullname,
        identity_number,
        identity_type,
        gender,
        birth_place,
        birth_date,
        whatsapp_number,
        password
      } = this.req.body;

      if (!password) throw new Error("Password tidak boleh kosong");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newMember = await Member.create(
        {
          company_id: this.company_id,
          division_id: divisionIdInt,
          fullname,
          identity_number,
          identity_type,
          gender,
          birth_place,
          birth_date,
          whatsapp_number,
          password: hashedPassword,
          photo,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      memberId = newMember.id;
      this.message = `Menambahkan member & user baru: ${fullname} (Member ID: ${memberId})`;
    }

    // Buat User baru dengan member yang sudah ada atau baru dibuat
    const newUser = await User.create(
      {
        member_id: memberId,
        grup_id: grupIdInt,
        division_id: divisionIdInt,
        createdAt: myDate,
        updatedAt: myDate,
      },
      { transaction: this.t }
    );

    this.message += ` dan User ID: ${newUser.id}`;
    return await this.response();
  } catch (error) {
    this.state = false;
    this.message = error.message;
    return await this.response();
  }
}



  // Edit Pengguna
async editPengguna() {
  await this.initialize();

console.log('📩 Data sebelum parsing:', this.req.body);

let { id, grup_id } = this.req.body;

  try {
    const model_r = new Model_r(this.req);
    const infoPengguna = await model_r.infoPengguna(id);
    if (!infoPengguna) throw new Error("Pengguna tidak ditemukan");

    // Konversi id dan grup_id ke integer
    id = Number(id);
    grup_id = Number(grup_id);

    console.log('📝 Data setelah parsing:', { id, grup_id });

    if (isNaN(id) || isNaN(grup_id)) {
      throw new Error('ID atau grup_id tidak valid');
    }

    const updateData = { grup_id };

    await User.update(updateData, { where: { id }, transaction: this.t });

    this.message = `Memperbarui grup pengguna ID: ${id} menjadi Grup ID: ${grup_id}`;
    return await this.response();
  } catch (error) {
    console.error('❌ Error Backend:', error);
    this.state = false;
    this.message = error.message;
    return await this.response();
  }
}




  // Hapus Pengguna
  async hapusPengguna() {
    await this.initialize();
    const { id } = this.req.body;
    try {
      const model_r = new Model_r(this.req);
      const infoPengguna = await model_r.infoPengguna(id);
      if (!infoPengguna) throw new Error("Pengguna tidak ditemukan");

      await User.destroy({ where: { id }, transaction: this.t });
      this.message = `Menghapus Pengguna dengan Username: ${infoPengguna.fullname} dan ID: ${id}`;
      return await this.response();
    } catch (error) {
      this.state = false;
      this.message = error.message;
      return await this.response();
    }
  }

  // Response handler
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return { success: true, message: this.message };
    } else {
      await this.t.rollback();
      return { success: false, message: this.message };
    }
  }
}

module.exports = Model_cud;
