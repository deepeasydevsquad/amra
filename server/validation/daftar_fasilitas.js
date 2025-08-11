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

validation.check_delete_is_allow = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    const q = await Mst_fasilitas.findOne({
        where: { id: id },
    });
    const nomor_akun = q.nomor_akun;

    const qDebet = await Jurnal.findAndCountAll({ where: { akun_debet : nomor_akun }, include: { model: Division, required: true, where: { company_id: company_id } } } );
    
    // .then(async (e) => {
    // if (e) {
    //     data["id"] = e.id;
    //     data["name"] = e.name;
    // }
    // });
}

module.exports = validation;