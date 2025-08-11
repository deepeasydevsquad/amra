const { sequelize, Mst_fasilitas } = require("../../../models");
const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async get_nomor_akun( company_id ) {
    var num = 19110;
    let condition = true;
    while (condition) {
      num++;
      var check = await Mst_fasilitas.findOne({ where: { nomor_akun: num, company_id: company_id } });
      if (!check) condition = false;
    }
    return num
  }

  // Tambah Fasilitas
  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const nomor_akun = await this.get_nomor_akun( this.company_id );
      const insert = await Mst_fasilitas.create(
        {
          company_id: this.company_id, 
          name: body.name,
          nomor_akun: nomor_akun,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Fasilitas Baru dengan Nama Fasilitas: ${body.name} dan ID Fasilitas: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit fasilitas
  async update() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const infoFasilitas = await model_r.infoFasilitas(body.id, this.company_id);

      await Mst_fasilitas.update(
        {
          name: body.name,
          updatedAt: myDate,
        },
        {
          where: { id: body.id, company_id: this.company_id,  },
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Memperbaharui Data Fasilitas dengan Nama Fasilitas: ${infoFasilitas.name} dan ID Fasilitas: ${body.id} menjadi Nama Fasilitas: ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus Fasilitas
  async delete() {
    await this.initialize();
    const body = this.req.body;
    try {
      const model_r = new Model_r(this.req);
      const infoFasilitas = await model_r.infoFasilitas(body.id, this.company_id);
      
      await Mst_fasilitas.destroy(
        {
          where: {
            id: body.id,
            company_id: this.company_id
          },
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menghapus Fasilitas dengan Nama Fasilitas: ${infoFasilitas.name} dan ID Fasilitas: ${infoFasilitas.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
