const { Division, Jamaah, Peminjaman } = require("../models");
const { getCabang, getCompanyIdByCode, tipe } = require("../helper/companyHelper");
const { convertToRP } = require("../helper/currencyHelper");
    
const validation = {};

validation.check_id_jamaah = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    const tipes = await tipe(req);
    if( tipes === 'administrator' ) {
        var check = await Jamaah.findOne({ 
            include : {
                required : true, 
                model : Division,
                where : { 
                    company_id : company_id
                }
            }
        });
        if (!check) {
            throw new Error("ID Jamaah tidak terdaftar dipangkalan data");
        }
    } else if ( tipes != 'administrator') {
        const division_id = await getCabang(req);
        var check = await Jamaah.findOne({ 
            where : { 
                division_id : division_id
            }
        });
        if (!check) {
            throw new Error("ID Jamaah tidak terdaftar dipangkalan data");
        }
    }
    return true;
}

validation.check_id_peminjaman = async ( value, { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    var check = await Peminjaman.findOne({ where: { id : value, company_id }});
    if (!check) {
        throw new Error("ID Peminjaman tidak terdaftar dipangkalan data");
    }
    return true;
}

validation.check_skema = async ( value,  { req } ) => {
    const company_id = await getCompanyIdByCode(req);
    const qPeminjaman = await Peminjaman.findOne({ where: { id: req.body.peminjaman_id, company_id: company_id } });
    const utang = qPeminjaman.nominal - qPeminjaman.dp;
    var error = false;
    // updatedSkema
    var totalNominal = 0;
    var tanggal_jatuh_tempo = [];
    for( let x in value ) {
        totalNominal = totalNominal + value[x].nominal;
        if(!tanggal_jatuh_tempo.includes(value[x].duedate) ){
            tanggal_jatuh_tempo.push(value[x].duedate)
        }else{
            error = true;
        }
    }
    // check total nominal angsuran
    if(utang != totalNominal) {
        throw new Error("Total Jumlah Nominal Angsuran Perbulan Tidak Sesuai Dengan Total Utang Yaitu: " +  await convertToRP(utang) );
    }
    // check duplikasi tanggal jatuh tempo.
    if(error) {
        throw new Error("Terdapat tanggal jatuh tempo yang duplikat.");
    }

    return true;
}


module.exports = validation;
  