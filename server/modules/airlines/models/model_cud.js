const Model_r = require("./model_r");
const { sequelize, Mst_airline } = require("../../../models");
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

  // Tambah Airline
  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const insert = await Mst_airline.create(
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

      this.message = `Menambahkan Airline Baru dengan Nama Airline: ${body.name} dan ID Airline: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit airline
  async update() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    try {
      const model_r = new Model_r(this.req);
      const infoAirline = await model_r.infoAirline(body.id, this.company_id);

      await Mst_airline.update(
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

      this.message = `Memperbaharui Data Airline dengan Nama Airline: ${infoAirline.name} dan ID Airline: ${body.id} menjadi Nama Airline: ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Hapus Airline
  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const infoAirline = await model_r.infoAirline(body.id, this.company_id);
      
      await Mst_airline.destroy(
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

      this.message = `Menghapus Airline dengan Nama Airline: ${infoAirline.name} dan ID Airline: ${infoAirline.id}`;
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
