const { sequelize, Riwayat_deposit_airline, Mst_airline, Mst_bank, Jurnal } = require("../../../models");
// const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { menghasilkan_invoice_riwayat_deposit_maskapai } = require("../../../helper/randomHelper");
const moment = require("moment");
// const { sumber_dana } = require("../../../validation/sumber_dana");

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

  async add_deposit() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      var akun_kredit = '';
      if(body.sumber_dana == 0) {
        akun_kredit = '11010'; //
      }else{
        const q = await Mst_bank.findOne({
          where: {
            id: body.sumber_dana,
            company_id: this.company_id
          },
        });
        akun_kredit = q.nomor_akun;
      }

      const qMaskapai = await Mst_airline.findOne({
          where: {
            id: body.mst_airline_id,
            company_id: this.company_id
          },
      });
      var akun_debet = qMaskapai.nomor_akun_deposit;

      const invoice = await menghasilkan_invoice_riwayat_deposit_maskapai();
      // insert riwayat deposit airlines
      await Riwayat_deposit_airline.create(
        {
          division_id: body.cabang,
          invoice: invoice, 
          sumber_dana: body.sumber_dana, 
          mst_airline_id: body.mst_airline_id,
          deposit: body.deposit,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // insert jurnal
      await Jurnal.create(
        {
          division_id: body.cabang, 
          source: 'depositmaskapai:' + invoice,
          ref: 'Deposit Maskapai',
          ket: 'Deposit Maskapai',
          akun_debet: akun_debet,
          akun_kredit: akun_kredit,
          saldo: body.deposit,
          removable: 'false',
          periode_id: 0,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      
      this.message = `Menambahkan deposit ke Maskapai ${qMaskapai.name} dengan Nomor Invoice: ${invoice} dan Nominal Deposit: ${body.deposit}`;
    } catch (error) {

        console.log("0000____0000QQQQQ");
        console.log(error); 
        console.log("0000____0000QQQQQ");
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
