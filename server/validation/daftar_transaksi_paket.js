const { 
    Paket,
    Paket_transaction

} = require("../models");
const { getCabang } = require("../helper/companyHelper");

const validation = {};

validation.check_id_paket = async (value, { req }) => {
    const division_id = await getCabang(req);
    console.log(division_id);
    console.log(value);
    var check = Paket.findOne({ where: { id : value, division_id : division_id }});
    if (!check) {
        throw new Error("ID Paket tidak terdaftar dipangkalan data");
    }

    return true;
}

validation.check_id_transpaket = async (value, { req }) => {
    const body = req.body;
    const division_id = await getCabang(req);
    var check = await Paket_transaction.findOne({ where: { id : value, division_id : division_id, paket_id : body.id }});
    if (!check) {
        throw new Error("ID Transaksi Paket tidak terdaftar dipangkalan data");
    }
}

// validation.check_nomor_visa = async (value, { req }) => {
//     const body = req.body;
//     const division_id = await getCabang(req);
//     var check = await Paket_transaction.findOne({ where: { id : body.id, division_id : division_id, nomor_visa : value }});
//     if (check) {
//         throw new Error("Nomor Visa telah digunakan");
//     }
// }

module.exports = validation;