const { Mst_fasilitas } = require("../models");

const { getCompanyIdByCode } = require("../helper/companyHelper");
    
const validation = {};

validation.check_id_fasilitas = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Mst_fasilitas.findOne({where: { id : value, company_id : company_id }});
    if (!check) {
        throw new Error("ID Fasilitas tidak terdaftar dipangkalan data");
    }
}

module.exports = validation;
  