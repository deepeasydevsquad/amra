const { Level_keagenan, Agen, Division } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async list() {
    const body = this.req.body;
    const limit = body.perpage || 10;
    const page = body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

    let where = {};
    let where_member = {};

    // Filter berdasarkan division_id jika ada
    if (body.cabang) {
      where_member.division_id = body.cabang;
    }

    // Filter berdasarkan pencarian (search)
    if (body.search) {
      where = {
        ...where,
        [Op.or]: [
          { fullname: { [Op.like]: `%${body.search}%` } },
          { identity_number: { [Op.like]: `%${body.search}%` } },
        ],
      };
    }

    const sql = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "createdAt",
        "updatedAt",
      ],
      where: where,
      include: [
        {
          required : true, 
          model : Member, 
          attributes: ['fullname'],
          where : where_member, 
          include: {
            required: true, 
            model : Division,
            attributes: ['name'],
          }
        },
        {
          required : true, 
          model : Level_keagenan, 
          attributes: ['name'],
        },
      ]
    };

    try {
      const q = await Agen.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        data = q.rows.map((e) => ({
          id: e.id,
          fullname : e.Member.fullname,
          level: e.Level_keagenan.name,
          cabang: e.Member.Division.name,
          fee_agen: 0,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        }));
      }

      return { data: data, total: total };
    } catch (error) {
      return { data: [], total: 0 };
    }
  }

  async infoAgen(id, company_id) {
    try {
      var data = {};
      await Level_keagenan.findOne({
        where: { id: id },
      }).then(async (e) => {
        if (e) {
          data["id"] = e.id;
          data["name"] = e.name;
        }
      });

      return data;
    } catch (error) {
      return {};
    }
  }
}

module.exports = Model_r;
