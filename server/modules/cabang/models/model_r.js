const { Division, Mst_kota } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getKota() {
    try {
      const kota = await Mst_kota.findAll({
        attributes: ["id", "name"],
      });

      return { success: true, data: kota };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllDivisions() {
    try {
      const company_id = await getCompanyIdByCode(this.req);
      if (!company_id) throw new Error("Company ID tidak ditemukan.");

      const divisions = await Division.findAll();

      return { success: true, data: divisions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDivisionById(id) {
    try {
      const company_id = await getCompanyIdByCode(this.req);
      if (!company_id) throw new Error("Company ID tidak ditemukan.");

      const division = await Division.findOne();

      if (!division) {
        return { success: false, error: "Division tidak ditemukan." };
      }

      return { success: true, data: division };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = Model_r;
