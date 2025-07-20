const { sequelize, Item_fasilitas } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { generate_item_code } = require("../../../helper/randomHelper");
const bcrypt = require("bcryptjs");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id = null;
    this.t = null;
    this.state = true;
    this.message = "";
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
  }

  async tambah_stok() {
    await this.initialize();
    const body = this.req.body;

    try {
      const jumlah = parseInt(body.jumlah || 1);
      const items = [];

      for (let i = 0; i < jumlah; i++) {
        const item_code = await generate_item_code();
        items.push({
          item_code,
          mst_fasilitas_id: body.mst_fasilitas_id,
          status: "belum_terjual",
          harga_beli: body.harga_beli,
          harga_jual: body.harga_jual,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      // ⛳ bulk insert pakai transaction
      await Item_fasilitas.bulkCreate(items, { transaction: this.t });

      this.message = `Menambahkan ${jumlah} stok fasilitas baru`;
    } catch (error) {
      console.error("Error tambah stok:", error);
    }
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
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
