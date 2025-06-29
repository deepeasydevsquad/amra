const { Member, Grup } = require("../models");
const { getCompanyIdByCode } = require("../helper/companyHelper");
const { convertToRP } = require("../helper/currencyHelper");
    
const validation = {};

validation.check_id_member = async ( value, { req } ) => {
    if( value ) {
        const company_id = await getCompanyIdByCode(req);
        var check = await Member.findOne({ where: { id : value, company_id }});
        if (!check) {
            throw new Error("ID Member tidak terdaftar dipangkalan data");
        }
    }
    return true;
}

validation.check_id_cabang = async ( value, { req } ) => {
    const body = req.body;
    if( ! body.member_id ) {
        const company_id = await getCompanyIdByCode(req);
        var check = await Division.findOne({ where: { id : value, company_id }});
        if (!check) {
            throw new Error("ID Cabang tidak terdaftar dipangkalan data");
        }
    }
    return true;
}

validation.check_id_grup = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Grup.findOne({ where: { id : value, company_id }});
    if (!check) {
        throw new Error("ID Grup tidak terdaftar dipangkalan data");
    }
    return true;
}

validation.check_fullname = async ( value, { req } ) => {
    if(!req.body.member_id) {
        if( !req.body.fullname ){
            throw new Error("Nama lengkap wajib diisi");
        }
    }
    return true;
}

validation.check_identity_number = async ( value, { req } ) => {
    if(!req.body.member_id) {
        if( !req.body.identity_number || req.body.identity_number == ''){
            throw new Error("Nomor identitas wajib diisi");
        }
    }
    return true;
}

validation.identity_type = async ( value, { req } ) => {
    if(!req.body.member_id) {
        if( !req.body.identity_type  || req.body.identity_type == ''){
            throw new Error("Tipe identitas wajib diisi");
        }
        // else if( ) {

        // }
    }
    return true;
}


    // body("fullname").custom(validation.check_fullname),
    // body("identity_number").custom(validation.check_identity_number),
    // body("identity_type").custom(validation.check_identity_type),
    // body("gender").custom(validation.check_gender),
    // body("birth_place").custom(validation.check_birth_place),
    // body("birth_date").custom(validation.check_birth_date),
    // body("whatsapp_number").custom(validation.check_whatsapp_number),
    // body("password").custom(validation.check_password),


module.exports = validation;
  