const { Op, Mst_fasilitas, Item_fasilitas, Mst_bank } = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
// const { dbList } = require("../../../helper/dbHelper");
const{ convertToRP } = require("../../../helper/currencyHelper");
const Akuntansi = require("../../../library/akuntansi");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
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

  async sumber_dana() {
    await this.initialize();

    const akuntansi = new Akuntansi(); 

    try {
      var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun('11010', this.company_id, this.division_id, '0') );

      console.log("------____------");
      console.log(saldo);
      console.log("------____------");

      var data = [{id: 0, name: 'KAS (Saldo : ' + saldo + ')'}];
      await Mst_bank.findAll({
        where: { 
          company_id: this.company_id
        }}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun(e.nomor_akun, this.company_id, this.division_id, '0') ) ;
            data.push({id: e.id, name: e.kode + ' (Saldo : ' + saldo + ') '});
          })
        );
      });


      return data;
    } catch (error) {
      console.log("xxxxxxxx--------------------");
      console.log(error);
      console.log("xxxxxxxx--------------------");
      throw new Error("Gagal mengambil sumber dana.");
    }
  }
}

module.exports = Model_r;
