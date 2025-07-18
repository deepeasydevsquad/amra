const { Op, Mst_fasilitas  } = require("../../../models");
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

  async list() {

    await this.initialize();

    const body = this.req.body;
    const limit = body.perpage || 10;
    const page = body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

    let where = { company_id : this.company_id};

    if (body.search != undefined && body.search != "") {
      where = {
        ...where,
       ...{ name: { [Op.like]: `%${body.search}%` } },
      };
    }

    const sql = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "name",
        "createdAt",
        "updatedAt",
      ],
      where: where,
    };

    try {
      const q = await Mst_fasilitas.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        await Promise.all(
          await q.rows.map(async (e) => {
            data.push({ 
              id : e.id, 
              name : e.name, 
              jumlah_stok: 0,
              jumlah_stok_terjual: 0
            });
          })
        );
       }

      return { data: data, total: total };
    } catch (error) {
      console.log("xxxxxxxx--------------------");
      console.log(error);
      console.log("xxxxxxxx--------------------");
      return { data: [], total: 0 };
    }
  }
}

//   async infoAgen(id) {
//     try {
//       const pengguna = await Agen.findOne({
//         where: { id },
//         attributes: ["id", "createdAt", "updatedAt"],
//         include: [
//           { model: Member, attributes: ["fullname"] },
//           { model: Level_keagenan, attributes: ["name"] },
//         ],
//       });
//       return pengguna || {};
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       return {};
//     }
//   }
// }

module.exports = Model_r;
