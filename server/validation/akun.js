const { Akun_primary, Division, Akun_secondary } = require("../models");

const { getCompanyIdByCode } = require("../helper/companyHelper");
    
const validation = {};

validation.check_akun = async ( value,  { req } ) => {
    if(value != '0') {
        var check = await Akun_primary.findOne({where: { id : value }});
        if (!check) {
            throw new Error("Akun ini tidak ditemukan dipangkalan data");
        }
    }
    return true;
}

validation.check_cabang = async ( value,  { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    if( value != '0' ) {
        var check = await Division.findOne({where: { id : value, company_id : company_id }});
        if (!check) {
            throw new Error("Cabang Tidak Ditemukan Dipangkalan Data");
        }
    }
    return true;
}

validation.check_nomor_akun = async ( value,  { req } ) => {
    const body = req.body;
    const company_id = await getCompanyIdByCode(req);
    const nomor_akun_full = body.prefix.toString() + value 
    var check = await Akun_secondary.findOne({where: { nomor_akun : nomor_akun_full, company_id : company_id, akun_primary_id : body.primary_id  }});
    if (check) {
        throw new Error("Nomor Akun ini sudah terdaftar dipangkalan data");
    }

    return true;
}

validation.check_prefix = async ( value,  { req } ) => {
    const body = req.body;
    var check = await Akun_primary.findOne({where: { id : body.primary_id }});
    var prefix = check.nomor_akun.toString().charAt(0);
    if( prefix !== value ) {
        throw new Error("Prefix Akun ini tidak ditemukan dipangkalan data");
    }

    return true;
}

validation.check_primary_id = async ( value ) => {
    var check = await Akun_primary.findOne({where: { id : value }});
    if (!check) {
        throw new Error("Primary ID Akun ini tidak ditemukan dipangkalan data");
    }
    return true;
}



module.exports = validation;
  