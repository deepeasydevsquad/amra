const { Pembayaran_gaji } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const {
  menghasilkan_invoice_pembayaran_gaji,
} = require("../../../helper/randomHelper");
const moment = require("moment");
const { sequelize } = require("../../../models");

class Model_cud {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.company_id = null;
    this.division_id;
    this.message = "";
    this.t = null;
    this.state = true;
  }

  async initialize() {
    this.t = await sequelize.transaction();
  }

  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const invoice = await menghasilkan_invoice_pembayaran_gaji();
    try {
      const insert = await Pembayaran_gaji.create(
        {
          division_id: body.division_id,
          user_id: body.user_id,
          invoice: invoice,
          nominal: body.nominal,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      this.state = true;
      this.message = "Pembayaran Gaji berhasil ditambahkan.";
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;
    try {
      await Pembayaran_gaji.destroy(
        {
          where: {
            id: body.id,
          },
        },
        {
          transaction: this.t,
        }
      );
      this.message = "Pembayaran Gaji berhasil dihapus.";
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
