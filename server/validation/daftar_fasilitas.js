const { Mst_fasilitas, Jurnal, Division } = require("../models");

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
        where: { id: value },
    });
    const nomor_akun = q.nomor_akun;
    var error = false;
    const qDebet = await Jurnal.findAndCountAll({ where: { akun_debet : nomor_akun }, include: { model: Division, required: true, where: { company_id: company_id } } } );
    const qKredit = await Jurnal.findAndCountAll({ where: { akun_kredit : nomor_akun }, include: { model: Division, required: true, where: { company_id: company_id } } } );
    if( qDebet.count > 0 ) {
        error = true;
    }
    if( qKredit.count > 0 ) {
        error = true;
    }

    if( error ) {
        throw new Error("Fasilitas ini tidak dapat dihapus, karena masih digunakan di Tabel Jurnal. Silahkan hapus terlebih dahulu di Jurnal agar Fasilitas ini dapat dihapus.");
    }
    return true;
}

module.exports = validation;