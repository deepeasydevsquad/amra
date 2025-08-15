const { Mst_bank } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
const validation = {};

validation.sumber_dana = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    if(value != 0  ) {
        var check = await Mst_bank.findOne({where: { id : value, company_id : company_id }});
        if (!check) {
            throw new Error("ID Bank tidak terdaftar dipangkalan data");
        }
    }
    return true;
}


module.exports = validation;
  