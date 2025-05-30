const { sequelize, Member, Division } = require("../../../models");
const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { data } = require("jquery");

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
    if (!this.company_id) throw new Error("company_id tidak ditemukan");

    this.t = await sequelize.transaction();
  }

  async getDivisionId() {
    const userType = await tipe(this.req);
    if (userType === "administrator") {
      return this.req.body.division_id;
    } else if (userType === "staff") {
      const decoded = jwt.decode(
        this.req.headers["authorization"]?.split(" ")[1]
      );
      return decoded?.division_id;
    } else {
      throw new Error("Role pengguna tidak valid.");
    }
  }

  async add() {
    await this.initialize();
    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const division_id = await this.getDivisionId();
      if (!division_id) throw new Error("division_id tidak ditemukan");

      // Ambil file foto dari request
      const photo = this.req.file ? this.req.file.path : null;

      // Enkripsi password menggunakan bcryptjs
      const salt = await bcrypt.genSalt(10); // Generate salt
      const hashedPassword = await bcrypt.hash(body.password, salt); // Hash password

      const insert = await Member.create(
        {
          division_id: division_id,
          fullname: body.fullname,
          identity_number: body.identity_number,
          identity_type: body.identity_type,
          gender: body.gender,
          birth_place: body.birth_place,
          birth_date: body.birth_date,
          whatsapp_number: body.whatsapp_number,
          password: hashedPassword, // Simpan password yang sudah dienkripsi
          photo: photo, // Simpan path foto ke database
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.message = `Menambahkan member baru: ${body.fullname} (ID: ${insert.id})`;
      await writeLog(this.req, this.t, { msg: this.message });

      await this.t.commit();
      return { success: true, message: this.message, data: insert };
    } catch (error) {
      await this.t.rollback();
      return { success: false, message: error.message };
    }
  }

  async update() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call model_r object
      const model = new Model_r(this.req);
      // Cari member berdasarkan ID
      const member = await model.infoMember(body.id); // Teruskan transaksi

      // const model_r = new Model_r(this.req);

      // // Cari member berdasarkan ID
      // const member = await model_r.infoMember(body.id, this.t); // Teruskan transaksi
      // if (!member) throw new Error("Member tidak ditemukan");

      // // Ambil division_id dari getDivisionId() jika tidak disediakan di req.body
      // const division_id = body.division_id || (await this.getDivisionId());
      // if (!division_id) throw new Error("division_id tidak ditemukan");

      // // Ambil file foto dari request, jika ada
      // const photo = this.req.file ? this.req.file.path : member.photo;

      // // Jika password diupdate, enkripsi password baru
      // let hashedPassword = member.password; // Default: gunakan password lama
      // if (body.password) {
      //   const salt = await bcrypt.genSalt(10); // Generate salt
      //   hashedPassword = await bcrypt.hash(body.password, salt); // Hash password baru
      // }

      // // Pastikan data yang diperlukan ada
      // if (!body.fullname || !body.identity_number) {
      //   throw new Error("Data yang diperlukan tidak lengkap");
      // }

      // // Siapkan data untuk diupdate
      // const updateData = {
      //   fullname: body.fullname,
      //   identity_number: body.identity_number,
      //   identity_type: body.identity_type,
      //   gender: body.gender,
      //   birth_place: body.birth_place,
      //   birth_date: body.birth_date,
      //   whatsapp_number: body.whatsapp_number,
      //   password: hashedPassword, // Update password yang sudah dienkripsi
      //   updatedAt: myDate,
      // };

      // // Hanya update foto jika ada file yang diupload
      // if (this.req.file) {
      //   updateData.photo = photo;
      // }

      // // Update data berdasarkan id dan division_id
      // const [updatedRows] = await Member.update(updateData, {
      //   where: { id: body.id, division_id: division_id },
      //   transaction: this.t,
      // });

      // // Cek apakah ada baris yang diupdate
      // if (updatedRows === 0) {
      //   throw new Error(
      //     "Tidak ada data yang diupdate. Periksa ID atau division_id."
      //   );
      // }

      // // Log pesan update
      // this.message = `Memperbarui Member ID ${body.id} (${member.fullname}) menjadi ${body.fullname}`;
      // await writeLog(this.req, this.t, { msg: this.message });

      // // Commit transaksi
      // await this.t.commit();
      // return { success: true, message: this.message };
    } catch (error) {
      this.state = false;
      // console.error("❌ Gagal mengupdate member:", error);
      // await this.t.rollback();
      // return { success: false, message: error.message };
    }
  }

  // delete member
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call model
      const model_r = new Model_r(this.req);
      const member = await model_r.infoMember(body.id);
      // destroy
      await Member.destroy(
        {
          where: { id: body.id },
          include: {
            required : true, 
            model : Division, 
            where: { 
              company_id: this.company_id
            }
          }
        }, 
        {
          transaction: this.t,
        }
      );
      this.message = `Menghapus Member ${member.fullname} (ID: ${member.id})`;
    } catch (error) {
      this.state = false;
    }
  }

  // response
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
