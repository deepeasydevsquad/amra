const Model_r = require("./model_r");
const { sequelize, Akun_secondary, Saldo_akun } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const moment = require("moment");
const akun_primary = require("../../../models/akun_primary");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // Tambah Akun
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {

      const primary_id = body.primary_id;
      const prefix = body.prefix;
      const nomor_akun = prefix + body.nomor;
      const nama_akun = body.nama;
      const saldo = body.saldo;

      // insert process
      const insert = await Akun_secondary.create(
        {
          company_id : this.company_id, 
          akun_primary_id : primary_id,
          nomor_akun: nomor_akun,
          nama_akun: nama_akun,
          tipe_akun: 'tambahan',
          path: '',
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      if(saldo > 0 ) {
        // insert ke saldo
        await Saldo_akun.create(
          {
            division_id : this.division_id, 
            akun_secondary_id : insert.id,
            saldo: saldo,
            periode: 0,
            createdAt: myDate,
            updatedAt: myDate,
          },
          {
            transaction: this.t,
          }
        );
      }
      // write log message
      this.message = `Menambahkan Akun Baru dengan Nama Akun : ${body.nama}, Nomor Akun : ${nomor_akun} dan ID Akun : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // update Akun
  async update() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const primary_id = body.primary_id;
    const prefix = body.prefix;
    const nomor_akun = prefix + body.nomor;
    const nama_akun = body.nama;
    const saldo = body.saldo;

    try {
      // delete saldo
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: body.id,
            division_id : this.division_id
          },
        },
        {
          transaction: this.t,
        }
      );

      // insert process
      const insert = await Akun_secondary.update(
        {
          nomor_akun: nomor_akun,
          nama_akun: nama_akun,
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

      if(saldo > 0 ) {
        // insert ke saldo
        await Saldo_akun.create(
          {
            division_id : this.division_id, 
            akun_secondary_id : insert.id,
            saldo: saldo,
            periode: 0,
            createdAt: myDate,
            updatedAt: myDate,
          },
          {
            transaction: this.t,
          }
        );
      }

      // write log message
      this.message = `Memperbaharui data akun ID Akun : ${body.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // delete Akun
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // delete saldo
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: body.id,
            division_id : this.division_id
          },
        },
        {
          transaction: this.t,
        }
      );
      // delete akun seconday
      await Akun_secondary.destroy(
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
      this.message = `Menghapus Akun dengan ID Aakun : ${body.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // // Edit airline
  // async update() {
  //   // initialize general property
  //   await this.initialize();
  //   const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  //   const body = this.req.body;
  //   // update process
  //   try {
  //     // call object
  //     const model_r = new Model_r(this.req);
  //     // get info airline
  //     const infoAirline = await model_r.infoAirline(body.id, this.company_id);
  //     // update data airline
  //     await Mst_airline.update(
  //       {
  //         name: body.name,
  //         updatedAt: myDate,
  //       },
  //       {
  //         where: { id: body.id, company_id : this.company_id,  },
  //       },
  //       {
  //         transaction: this.t,
  //       }
  //     );
  //     // write log message
  //     this.message = `Memperbaharui Data Airline dengan Nama Airline ${infoAirline.name} dan ID Airline : ${body.id} menjadi Nama Airline ${body.name}`;
  //   } catch (error) {
  //     this.state = false;
  //   }
  // }

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
