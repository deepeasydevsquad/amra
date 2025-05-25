const { Op, Investor, Member, Division } = require("../../../models");
const{ getCompanyIdByCode, tipe, username, getCabang } = require("../../../helper/companyHelper");
const{ dbList } = require("../../../helper/dbHelper");
const{ convertToRP } = require("../../../helper/currencyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.type;
    this.division;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.type = await tipe(this.req);
    this.division = await getCabang(this.req);
  }

  async paramCabang() {
    // initialize dependensi properties
    await this.initialize();
    var data = [];
    if( this.type === 'administrator' ) {
      const { rows } = await Division.findAndCountAll({ where : { company_id : this.company_id} });
      await Promise.all(
        await rows.map(async (e) => {
          data.push({id: e.id,name: e.name });
        })
      );
    }else{
      const { rows } = await Division.findAndCountAll({ where : { id: this.division, company_id : this.company_id} });
      await Promise.all(
        await rows.map(async (e) => {
          data.push({id: e.id,name: e.name });
        })
      );
    }
    return data;
  }
}

module.exports = Model_r;
