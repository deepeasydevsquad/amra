const { sequelize, Mst_mobil } = require("../../../models");
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
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // Tambah Jenis Mobil
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // insert process
      const insert = await Mst_mobil.create(
        {
          company_id : this.company_id, 
          name: body.name,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menambahkan Jenis Mobil Baru dengan Nama Jenis Mobil : ${body.name} dan ID Jenis Mobil  : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit jenis mobil
  async update() {
    // initialize general property
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    // update process
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info jenis mobil
      const infoJenisMobil = await model_r.infoJenisMobil(body.id, this.company_id);
      // update data jenis mobil
      await Mst_mobil.update(
        {
          name: body.name,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          where: { id: body.id, company_id : this.company_id,  },
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Memperbaharui Data Jenis Mobil dengan Nama Jenis Mobil ${infoJenisMobil.name} dan ID Jenis Mobil : ${body.id} menjadi Nama Jenis Mobil ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus Jenis Mobil
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info fasilitas
      const infoJenisMobil = await model_r.infoJenisMobil(body.id, this.company_id);
      // delete process
      await Mst_mobil.destroy(
        {
          where: {
            id: body.id,
            company_id : this.company_id
          },
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menghapus Jenis Mobil dengan Nama Jenis Mobil : ${infoJenisMobil.name} dan ID Jenis Mobil  : ${infoJenisMobil.id}`;
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
      // commit
      await this.t.commit();
      return true;
    } else {
      // rollback
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
