const { Op, Agen, Level_keagenan, Member, Division  } = require("../../../models");
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
        where_member = {
          ...where_member,
          [Op.or]: [
            { fullname: { [Op.like]: `%${body.search}%` } },
            { identity_number: { [Op.like]: `%${body.search}%` } },
          ],
        };
      }
      // 
  
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
            attributes: ['fullname', "identity_number"],
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
            nomor_identitas: e.Member.identity_number,
            level: e.Level_keagenan.name,
            cabang: e.Member.Division.name,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          }));
        }
  
        return { data: data, total: total };
      } catch (error) {
        console.log("xxxxxxxx--------------------");
        console.log(error);
        console.log("xxxxxxxx--------------------");
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
