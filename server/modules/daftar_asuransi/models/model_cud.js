const { sequelize, Mst_asuransi } = require("../../../models");
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

  // Tambah Asuransi
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // insert process
      const insert = await Mst_asuransi.create(
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
      this.message = `Menambahkan Asuransi Baru dengan Nama Asuransi : ${body.name} dan ID Asuransi : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit asuransi
  async update() {
    // initialize general property
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    // update process
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info asuransi
      const infoAsuransi = await model_r.infoAsuransi(body.id, this.company_id);
      // update data asuransi
      await Mst_asuransi.update(
        {
          name: body.name,
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
      this.message = `Memperbaharui Data Asuransi dengan Nama Asuransi ${infoAsuransi.name} dan ID Asuransi : ${body.id} menjadi Nama Asuransi ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus Asuransi
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info asuransi
      const infoAsuransi = await model_r.infoAsuransi(body.id, this.company_id);
      // delete process
      await Mst_asuransi.destroy(
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
      this.message = `Menghapus Asuransi dengan Nama Asuransi : ${infoAsuransi.name} dan ID Asuransi  : ${infoAsuransi.id}`;
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
