const Model_r = require("./model_r");
const { sequelize, Investor } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { hideCurrency } = require("../../../helper/currencyHelper");

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

  // Tambah Investor
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // insert process
      const insert = await Investor.create(
        {
          company_id : this.company_id, 
          name: body.name,
          identity_number: body.identity_number,
          mobile_phone: body.mobile_phone,
          address: body.address,
          invesment: body.invesment,
          stock: body.stock,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menambahkan Investor Baru dengan Nama Investor : ${body.name} dan ID Investor  : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // Edit airline
  async update() {
    // initialize general property
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    // update process
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info investor
      const infoInvestor = await model_r.infoInvestor(body.id, this.company_id);

      // update data investor
      await Investor.update(
        {
          name: body.name,
          identity_number: body.identity_number,
          mobile_phone: body.mobile_phone,
          address: body.address,
          invesment: await hideCurrency(body.invesment),
          stock: body.stock,
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
      this.message = `Memperbaharui Data Investor dengan Nama Investor ${infoInvestor.name} dan ID Investor : ${body.id} menjadi Nama Investor ${body.name}`;
    } catch (error) {
      this.state = false;
    }
  }

  // // Hapus Airline
  // async delete() {
  //   // initialize dependensi properties
  //   await this.initialize();
  //   const body = this.req.body;
  //   try {
  //     // call object
  //     const model_r = new Model_r(this.req);
  //     // get info airline
  //     const infoAirline = await model_r.infoAirline(body.id, this.company_id);
  //     // delete process
  //     await Mst_airline.destroy(
  //       {
  //         where: {
  //           id: body.id,
  //           company_id : this.company_id
  //         },
  //       },
  //       {
  //         transaction: this.t,
  //       }
  //     );
  //     // write log message
  //     this.message = `Menghapus Airline dengan Nama Airline : ${infoAirline.name} dan ID Airline  : ${infoAirline.id}`;
  //   } catch (error) {
  //     this.state = false;
  //   }
  // }

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
