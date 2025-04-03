const { Op, Agen, Level_keagenan, Member } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async daftar_Agen() {
    await this.initialize();
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
      attributes: ["id", "createdAt", "updatedAt"],
      where,
      include: [
        { model: Member, attributes: ["fullname"] },
        { model: Level_keagenan, attributes: ["name"] },
      ],
    };

    try {
      const { count, rows } = await Agen.findAndCountAll(sql);
      return { data: rows, total: count };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: [], total: 0 };
    }
  }

  async infoAgen(id) {
    try {
      const pengguna = await Agen.findOne({
        where: { id },
        attributes: ["id", "createdAt", "updatedAt"],
        include: [
          { model: Member, attributes: ["fullname"] },
          { model: Level_keagenan, attributes: ["name"] },
        ],
      });
      return pengguna || {};
    } catch (error) {
      console.error("Error fetching user info:", error);
      return {};
    }
  }
}

module.exports = Model_r;
