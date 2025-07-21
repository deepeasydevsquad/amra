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

  async hapus_stok() {
    await this.initialize();
    const body = this.req.body;

    try {
      const id = body.id; // atau pakai item_code kalau kamu pakai itu
      if (!id) {
        this.state = false;
        this.message = "ID item tidak ditemukan";
        return;
      }

      const item = await Item_fasilitas.findOne({
        where: {
          id,
        },
      });

      if (!item) {
        this.state = false;
        this.message = "Data tidak ditemukan";
        return;
      }

      if (item.status === "terjual") {
        this.state = false;
        this.message = "Data sudah terjual, tidak bisa dihapus";
        return;
      }

      await item.destroy({ transaction: this.t });

      this.state = true;
      this.message = "Data berhasil dihapus";
    } catch (error) {
      this.state = false;
      this.message = "Terjadi kesalahan saat menghapus data";
      console.error("hapus_stok error:", error);
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
