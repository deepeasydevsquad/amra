const { Op, Mst_fasilitas, Item_fasilitas } = require("../../../models");
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
    const page =
      body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

    let where = { company_id: this.company_id };

    if (body.search != undefined && body.search != "") {
      where = {
        ...where,
        name: { [Op.like]: `%${body.search}%` },
      };
    }

    const sql = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name", "createdAt", "updatedAt"],
      where: where,
    };

    try {
      const q = await Mst_fasilitas.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        await Promise.all(
          q.rows.map(async (e) => {
            // Ambil total stok yang BELUM terjual
            const stokBelumTerjual = await Item_fasilitas.count({
              where: {
                mst_fasilitas_id: e.id,
                status: "belum_terjual",
              },
            });

            // Ambil total stok yang SUDAH terjual
            const stokTerjual = await Item_fasilitas.count({
              where: {
                mst_fasilitas_id: e.id,
                status: "terjual",
              },
            });

            console.log("xxxxxxxxxxxxxx");
            console.log(stokBelumTerjual);
            console.log(stokTerjual);
            console.log("xxxxxxxxxxxxxx");

            data.push({
              id: e.id,
              name: e.name,
              jumlah_stok: stokBelumTerjual,
              jumlah_stok_terjual: stokTerjual,
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

module.exports = Model_r;
