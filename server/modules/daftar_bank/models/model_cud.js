const { sequelize, Op, Mst_bank, Akun_secondary, Saldo_akun } = require("../../../models");
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
    // call object
    const model_r = new Model_r(this.req);
    const new_nomor_akun_bank = await model_r.generate_nomor_akun_secondary_bank(this.company_id);
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

      // add new akun secondary
      await Akun_secondary.create(
        {
          company_id: this.company_id, 
          akun_primary_id: 1, 
          nomor_akun: new_nomor_akun_bank,
          nama_akun: body.name.toUpperCase(),
          tipe_akun: 'bawaan',
          path: 'bank:kodeBank:' + body.kode,
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
      const idAkunSecondary = await model_r.getInfoAkunSecondary(this.company_id, infoBank.kode);
      // update kode akun secondary bank
      await Akun_secondary.update(
        {
          path: 'bank:kodeBank:' + body.kode,
          updatedAt: myDate,
        },
        {
          where: { id: idAkunSecondary.id, company_id : this.company_id,  },
        },
        {
          transaction: this.t,
        }
      );

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
      console.log('XXXX');
      console.log(error);
      console.log('XXXX');
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
      const idAkunSecondary = await model_r.getInfoAkunSecondary(this.company_id, infoBank.kode);
      const list_division_id = await model_r.get_seluruh_cabang_id(this.company_id);

      // saldo akun
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: idAkunSecondary.id,
            division_id : {
              [Op.in] : list_division_id
            }
          },
        },
        {
          transaction: this.t,
        }
      );

      // akun secondary
      await Akun_secondary.destroy(
        {
          where: {
            id : idAkunSecondary.id, 
            company_id: this.company_id
          },
        },
        {
          transaction: this.t,
        }
      );      

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

      console.log("Error CCCCCC");
      console.log(error);
      console.log("Error CCCCCC");
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
