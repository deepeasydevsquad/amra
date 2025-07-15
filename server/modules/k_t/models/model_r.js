const moment = require("moment");
const { Paket, Division } = require("../../../models");
const{ getCompanyIdByCode, tipe, getCabang } = require("../../../helper/companyHelper");
const{ convertToRP } = require("../../../helper/currencyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.type;
    this.cabang_id;
  }

  /* 
    Initialitation function
  */
  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.type = await tipe(this.req);
    this.cabang_id = await getCabang(this.req);
  }

  /* 
    Dapatkan daftar akun by company and division
  */
  async list() {
    // initialize dependensi properties
    await this.initialize();

    const body = this.req.body;
    try {
      const { rows } = await Paket.findAndCountAll({ 
        where : { 
          id : body.paket_id 
        }, 
        include: { 
          required : true, 
          model: Division, 
          where: { company_id: this.company_id}
        }
      });
      var data = {};
      await Promise.all(
        await rows.map(async (e) => {
          data['name'] = e.name;
        })
      );
      data['total_anggaran'] = 0;
      data['belanja'] = 0;
      data['keuntungan'] = 0;
      return { data: data  };
    } catch (error) {

    console.log("__________________SSSS");
    console.log(error);
    console.log("__________________SSSS");

      return {};
    }
  }

}

module.exports = Model_r;
