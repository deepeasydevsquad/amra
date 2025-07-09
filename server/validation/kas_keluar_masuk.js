const { Akun_secondary } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
const validation = {};

validation.check_akun = async ( value,  { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Akun_secondary.findOne({where: { id : value, company_id: company_id }});
    if (!check) {
        throw new Error("ID Akun ini tidak ditemukan dipangkalan data");
    }
    return true;
}



module.exports = validation;
  