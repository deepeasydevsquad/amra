const {
  Member,
  Deposit,
  Company,
  sequelize,
  Division,
} = require("../../../models");
const { Op } = require("sequelize");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    console.log("company_id =>", this.company_id);
    this.t = await sequelize.transaction();
  }

  async dataCompany() {
    await this.initialize();
    console.log("Cek company ID sebelum query:", this.company_id);

    const company = await Company.findOne({
      where: { id: this.company_id },
      include: [{ model: Division }],
      transaction: this.t,
    });

    if (!company) {
      console.log("Company dengan ID ini gak ditemukan:", this.company_id);
      throw new Error("Data company tidak ditemukan");
    }

    return company;
  }

  async daftarDeposit() {
    const body = this.req.body;
    var limit = body.perpage || 10;
    var page = body.pageNumber || 1;

    var where = {};
    if (body.search) {
      where = {
        ...where,
        [Op.or]: [{ id: { [Op.like]: `%${body.search}%` } }],
      };
    }

    var sql = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "saldo_sebelum",
        "saldo_sesudah",
        "penerima",
        "invoice",
        "createdAt",
        "updatedAt",
      ],
      where,
      include: [{ model: Member, attributes: ["fullname"], as: "Member" }],
    };

    try {
      const { count, rows } = await Deposit.findAndCountAll(sql);
      return { data: rows, total: count };
    } catch (error) {
      console.error("Error fetching deposits:", error);
      return { data: [], total: 0 };
    }
  }

  async infoDeposit() {
    const { id } = this.req.body; // ✅ ambil id dengan destructure
    console.log("ID dari frontend:", id); // Harus angka, bukan { id: 45 } atau "45"

    try {
      const dataDeposit = await Deposit.findOne({
        where: { id },
        include: [{ model: Member, attributes: ["fullname"], as: "Member" }],
      });
      return dataDeposit || {};
    } catch (error) {
      console.error("Error fetching data deposit info:", error);
      return {};
    }
  }
}

module.exports = Model_r;
