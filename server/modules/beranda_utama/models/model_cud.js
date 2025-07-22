const { 
  sequelize,
  Company,
  Jamaah,
  Headline,
  Member,
  } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.division_id;
    this.company_id;
  } 

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async deleteHeadline() {
    await this.initialize();
    const body = this.req.body;

    try {
      await Headline.destroy({
        transaction: this.t,
        where: { id: body.id, company_id: this.company_id },
      });

      this.message = "Headline berhasil dihapus dengan id " + body.id;
    } catch (error) {
      console.log("Error in deleteHeadline:", error);
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
