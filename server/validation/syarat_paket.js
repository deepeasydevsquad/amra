const { 
    Paket,
    Paket_transaction,
} = require("../models");
const { getCabang } = require("../helper/companyHelper");

const validation = {};

validation.check_id_paket = async (value, { req }) => {
    const division_id = await getCabang(req);
    var check = await Paket.findOne({ where: { id : value, division_id : division_id }});
    if (!check) {
        throw new Error("ID Paket tidak terdaftar dipangkalan data");
    }
    return true;
}

module.exports = validation;