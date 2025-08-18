const { Mst_bank, Mst_airline, Riwayat_deposit_airline } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
const validation = {};

validation.check_id = async (value, { req }) => {

    console.log("-----XX");
    console.log(req.body.cabang);
    console.log("-----XX");
    const check = await Riwayat_deposit_airline.findOne({
        where: { id: value, division_id: req.body.cabang },
    });
    console.log("-----XX");
    console.log(check); 
    console.log("-----XX");
    // check
    if (!check) {
        throw new Error("ID riwayat deposit airline tidak terdaftar di pangkalan data.");
    }
    return true;
};

validation.check_sumber_dana = async (value, { req }) => {
    if(value != 0){
        const company_id = await getCompanyIdByCode(req);
        const check = await Mst_bank.findOne({
            where: { id: value, company_id },
        });
        // check
        if (!check) {
            throw new Error("ID sumber dana tidak terdaftar di pangkalan data.");
        }
    }
    return true;
};

validation.check_mst_airline_id = async (value, { req }) => {
    const company_id = await getCompanyIdByCode(req);
    const check = await Mst_airline.findOne({
        where: { id: value, company_id },
    });
    // check
    if (!check) {
        throw new Error("ID Maskapai tidak terdaftar di pangkalan data.");
    }
    return true;
}

validation.check_deposit = async (value, { req }) => {
    if(value <= 1000) {
        throw new Error("Jumlah deposit tidak boleh lebih kecil dari Rp 1000 .");
    }
    return true;
}

module.exports = validation;
