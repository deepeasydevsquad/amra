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

  async get_division_by_member_id (member_id) {
    const q = await Member.findOne({
        where: { 
          id : member_id
        },
        include: {
          required : true, 
          model: Division, 
          where: { 
            company_id: this.company_id
          }
        }
      });
      return q.division_id;
  }


  // Tambah Pengguna
  async tambahPengguna() {
    // initialize 
    await this.initialize();

    const body = this.req.body;
    
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      var member_id;
      var division_id;

      if( ! body.member_id ) {
        division_id = body.division_id;

        const photo = this.req.file ? this.req.file.path : null;
        const { fullname, identity_number, identity_type, gender, birth_place, birth_date, whatsapp_number, password } = this.req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const iM = await Member.create(
          {
            company_id: this.company_id,
            division_id: division_id,
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
        // define member id
        member_id = iM.id;
      }else{
        // get division id from database by member id
        division_id = await this.get_division_by_member_id(body.member_id);
        member_id = this.req.body.member_id;
      }

      // insert new User
      const i = await User.create(
        {
          member_id: member_id,
          grup_id: this.req.body.grup_id,
          division_id: division_id,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      // message
      this.message = `Menambahkan staff baru dengan (Member ID: ${member_id}) dan (User ID: ${i.id})`;
    } catch (error) {

      console.log("----------------");
      console.log(error);
      console.log("----------------");

      this.state = false;
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
