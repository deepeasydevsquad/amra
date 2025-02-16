const { Mst_kota } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  // async daftar_kota() {
  //   try {
  //     const data = await Mst_kota.findAll();
  //     return await Promise.all(data.map(async (e) => ({
  //       id: e.id,
  //       company_id: e.company_id,
  //       kode: e.kode,
  //       name: e.name,
  //     })));
  //   } catch (error) {
  //     return [];
  //   }
  // }

  async daftar_kota() {
    try {
      var data = [];
      await Mst_kota.findAll().then(async (value) => {
        await value.map(async (e) => {
          data.push({ 
            id : e.id, 
            company_id : e.company_id, 
            kode : e.kode,
            name : e.name
          });
        });
      })
      return data;
    } catch (error) {
        return [];
    }
  }
}

module.exports = Model_r;
