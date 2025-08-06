const { Level_keagenan, Agen, Division } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const { Op } = require("sequelize"); // You need to import Op for Sequelize operations

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

      console.log("xxxxxxxx--------------------");
      console.log(error);
      console.log("xxxxxxxx--------------------");
      // console.error("ERROR: daftar_member()", error);
      return { data: [], total: 0 };
    }


    // try {
    //   // Initialize company_id
    //   await this.initialize();

    //   // // Destructure request body with default values
    //   // const {
    //   //   perpage = 10,
    //   //   pageNumber = 1,
    //   //   search = "",
    //   //   sortField = "id",
    //   //   sortOrder = "ASC",
    //   // } = this.req.body;

    //   // // Validate and sanitize pagination parameters
    //   // const limit = Math.min(parseInt(perpage) || 10, 100); // Max 100 items per page
    //   // const page = Math.max(parseInt(pageNumber) || 1, 1); // Minimum page 1
    //   // const offset = (page - 1) * limit;

    //   // // Validate sort parameters
    //   // const validSortFields = ["id", "level", "name", "default_fee"];
    //   // const sortBy = validSortFields.includes(sortField) ? sortField : "id";
    //   // const orderBy = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    //   //   ? sortOrder.toUpperCase()
    //   //   : "ASC";

    //   // // Build where clause
    //   // const where = {
    //   //   company_id: this.company_id,
    //   //   ...(search && {
    //   //     [Op.or]: [
    //   //       { name: { [Op.like]: `%${search}%` } },
    //   //       { kode: { [Op.like]: `%${search}%` } },
    //   //     ],
    //   //   }),
    //   // };

    //   // if (body.cabang) {
    //   //   where.division_id = body.cabang;
    //   // }

    //   // // Execute query
    //   // const { count, rows } = await Level_keagenan.findAndCountAll({
    //   //   where,
    //   //   limit,
    //   //   offset,
    //   //   order: [[sortBy, orderBy]],
    //   //   attributes: ["id", "level", "name", "default_fee"],
    //   // });

    //   // Prepare response
    //   return {
    //     success: true,
    //     data: rows,
    //     total: count,
    //   };
    // } catch (error) {
    //   console.error("Error in daftarLevelKeagenan:", error);

    //   // Custom error handling
    //   if (error.name === "SequelizeDatabaseError") {
    //     throw new Error("Database operation failed");
    //   } else if (error.name === "ValidationError") {
    //     throw error;
    //   } else {
    //     throw new Error("Failed to retrieve agency levels");
    //   }
    // }
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
