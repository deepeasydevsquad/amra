const { Company, Member } = require("../models");
    
const validation = {};

validation.company_code_login_process = async ( value,  { req } ) => {
    const body = req.body;
    if(body.type === 'staff' && value == '') {
        throw new Error("Kode Perusahaan Tidak Boleh Kosong Jika Anda Masuk Sebagai Staff.");
    }

    return true;
}

validation.username_login_process = async (valeu,  { req } ) => {

}

module.exports = validation;
  