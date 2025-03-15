const { sequelize, Mst_bank } = require("../../../models");
const Model_r = require("../models/model_r");
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

  // Tambah Bank
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // insert process
      const insert = await Mst_bank.create(
        {
          company_id : this.company_id, 
          kode: body.kode,
          name: body.name,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menambahkan Bank Baru dengan Kode Bank : ${body.kode} dan Nama Bank : ${body.name} dan ID Bank : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit Bank
  async update() {
    // initialize general property
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    // update process
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info Bank
      const infoBank = await model_r.infoBank(body.id, this.company_id);
      // update data Bank
      await Mst_bank.update(
        {
          kode: body.kode,
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
      this.message = `Memperbaharui Data Bank dengan Kode Bank ${infoBank.kode}, Nama Bank ${infoBank.name} dan ID Bank : ${body.id} menjadi Kode Bank ${body.kode} dan Nama Bank ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus Bank
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info Bank
      const infoBank = await model_r.infoBank(body.id, this.company_id);
      // delete process
      await Mst_bank.destroy(
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
      this.message = `Menghapus Bank dengan Kode Bank : ${infoBank.kode} dan Nama Bank : ${infoBank.name} dan ID Bank  : ${infoBank.id}`;
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
