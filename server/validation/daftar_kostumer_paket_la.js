const { Kostumer_paket_la } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
    
const validation = {};

validation.check_id_kostumer_paket_la = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Kostumer_paket_la.findOne({where: { id : value, company_id : company_id }});
    if (!check) {
        throw new Error("ID Kostumer Paket LA tidak terdaftar dipangkalan data");
    }
}

module.exports = validation;
  