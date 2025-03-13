const { Mst_airline } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
    
const validation = {};

validation.check_id_airlines = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Mst_airline.findOne({where: { id : value, company_id : company_id }});
    if (!check) {
        throw new Error("ID Maskapai tidak terdaftar dipangkalan data");
    }
}

module.exports = validation;