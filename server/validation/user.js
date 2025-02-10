const { Company, Member, Division } = require("../models");
    
const validation = {};

validation.company_code_login_process = async ( value,  { req } ) => {
    const body = req.body;
    if(body.type === 'staff' && value == '') {
        throw new Error("Kode Perusahaan Tidak Boleh Kosong Jika Anda Masuk Sebagai Staff.");
    }
    return true;
}

validation.username_login_process = async (value,  { req } ) => {
    const body = req.body;
    if( body.type == 'staff' ) {
        var check = await Member.findOne({
            where: { whatsapp_number: value },
            includes : {
                required : true, 
                model : Division,
                includes : {
                    required : true, 
                    model : Company,
                    where : { code : body.company_code }
                }
            }
        });
        if (!check) {
            throw new Error("Terdapat kesalahan pada username atau password anda.");
        }
    }else if( body.type == 'administrator' ) {
        var check = await Company.findOne({
            where: { username: value },
        });
        if (!check) {
            throw new Error("Terdapat kesalahan pada username atau password anda.");
        }
    }

    return true;
}

module.exports = validation;
  