const { sequelize, Kostumer_paket_la } = require("../../../models");
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

  // Tambah kostumer paket la
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // insert process
      const insert = await Kostumer_paket_la.create(
        {
          company_id: this.company_id,
          name: body.name,
          mobile_number: body.mobile_number,
          address: body.address,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menambahkan kostumer paket la Baru dengan Nama kostumer paket la : ${body.name} dan ID kostumer paket la : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit kostumer paket la
  async update() {
    // initialize general property
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    // update process
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info kostumer paket la
      const infoKostumerPaketLA = await model_r.infoKostumerPaketLA(body.id, this.company_id);
      // update data kostumer paket la
      await Kostumer_paket_la.update(
        {
          name: body.name,
          mobile_number: body.mobile_number,
          address: body.address,
          updatedAt: myDate,
        },
        {
          where: { id: body.id, company_id: this.company_id },
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Memperbaharui Data kostumer paket la dengan Nama kostumer paket la ${infoKostumerPaketLA.name} dan ID kostumer paket la : ${body.id} menjadi Nama kostumer paket la ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus kostumer paket la
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info kostumer paket la
      const infoKostumerPaketLA = await model_r.infoKostumerPaketLA(body.id, this.company_id);
      // delete process
      await Kostumer_paket_la.destroy(
        {
          where: {
            id: body.id,
            company_id: this.company_id,
          },
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menghapus kostumer paket la dengan Nama kostumer paket la : ${infoKostumerPaketLA.name} dan ID kostumer paket la : ${infoKostumerPaketLA.id}`;
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
