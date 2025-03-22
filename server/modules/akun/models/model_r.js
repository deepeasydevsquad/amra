const {Op, Akun_primary, Akun_secondary, Division, Saldo_akun } = require("../../../models");
const{ getCompanyIdByCode, tipe, getCabang } = require("../../../helper/companyHelper");
const{ dbList } = require("../../../helper/dbHelper");
const{ convertToRP } = require("../../../helper/currencyHelper");
const akun_primary = require("../../../models/akun_primary");
const saldo_akun = require("../../../models/saldo_akun");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.type;
    this.cabang_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.type = await tipe(this.req);
    this.cabang_id = await getCabang(this.req);
  }

  async filter_akun() {
    // initialize dependensi properties
    await this.initialize();
    
    try {
      var akun = [{id : 0, name : 'Pilih Semua Akun'}];
      await Akun_primary.findAll().then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              akun.push({ 
                id : e.id, 
                name : e.nomor_akun + ' | ' + e.nama_akun
              });
            })
          );
      });
      var cabang = [];
      var where_cabang = { company_id: this.company_id };
      if( this.type !== 'administrator' ) {
        where_cabang = {...where_cabang,...{company_id: this.company_id, id : this.cabang_id}}
      }else{
        cabang.push({id : 0, name : 'Pilih Semua Cabang'});
      }

      await Division.findAll( { where : where_cabang }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            cabang.push({ 
              id : e.id, 
              name : e.name
            });
          })
        );
      });
    
      return { akun, cabang };
    } catch (error) {
      return {}
    }
  }

  async get_seluruh_cabang_id ( company_id ) {
    var list_division_id = [];
    await Division.findAll( { where : { company_id : company_id } }).then(async (value) => {
      await Promise.all(
        await value.map(async (e) => {
          list_division_id.push(e.id);
        })
      );
    });
    return list_division_id;
  }

  async get_daftar_akun() {
    // initialize dependensi properties
    await this.initialize();

    const body = this.req.body;
    // const akun = body.akun;
    const cabang = body.cabang;

    try {

      var where_akun_primary = {};
      if( body.akun !== undefined && body.akun != '0') {
        where_akun_primary = {...where_akun_primary,...{ id : body.akun } };
      }

      var where = {};
      var devision_id = [];
      // get saldo akun
      if( this.type === 'administrator' && cabang == '0'  ) {
        devision_id = await this.get_seluruh_cabang_id(this.company_id);
      }else{
        devision_id.push(cabang);
      }

      var saldo_akun_primary = {};
      var saldo_akun_secondary = {};
      await Saldo_akun.findAll( {
        include : {
          required : true, 
          model : Akun_secondary
        },  
        where : { division_id : devision_id, periode : '0' } }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            // menghitung jumlah saldo akun secondary
            if(saldo_akun_secondary[e.akun_secondary_id] === undefined ) {
              saldo_akun_secondary = {...saldo_akun_secondary,...{[e.akun_secondary_id] : e.saldo}}
            }else{
              saldo_akun_secondary[e.akun_secondary_id] = parseInt(saldo_akun_secondary[e.akun_secondary_id]) + e.saldo;
            }
            // menghitung jumlah saldo akun primary
            if ( saldo_akun_primary[e.Akun_secondary.akun_primary_id] === undefined ) {
              saldo_akun_primary = {...saldo_akun_primary,...{[e.Akun_secondary.akun_primary_id] : e.saldo}}
            }else{
              saldo_akun_primary[e.Akun_secondary.akun_primary_id] = parseInt(saldo_akun_primary[e.Akun_secondary.akun_primary_id]) + e.saldo;
            }
          })
        );
      });

      var draf = {};
      await Akun_secondary.findAll({ 
        where : { company_id : this.company_id},
        include : {
          required : true, 
          model : Akun_primary,
          where : where_akun_primary
        }
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            if( draf[e.Akun_primary.nomor_akun] === undefined ) {
              draf[e.Akun_primary.nomor_akun] = { 
                id: e.Akun_primary.id, 
                type: 'header', 
                nomor: e.Akun_primary.nomor_akun, 
                name:e.Akun_primary.nama_akun, 
                tipe_akun : 'bawaan',
                saldo_awal : saldo_akun_primary[e.Akun_primary.id] === undefined ? 'Rp 0' : await convertToRP(saldo_akun_primary[e.Akun_primary.id]), 
                saldo_akhir : 'Rp 0'
              }
            }

            draf[e.nomor_akun] = { 
              id: e.id, 
              type: 'child', 
              nomor: e.nomor_akun, 
              name:e.nama_akun,
              tipe_akun : e.tipe_akun,
              saldo_awal : saldo_akun_secondary[e.id] === undefined ? "Rp 0" : await convertToRP(saldo_akun_secondary[e.id]), 
              saldo_akhir : "Rp 0"
            }
            
          })
        );
      });

      var data = [];
      for( let x in draf ){
        data.push(draf[x]);
      }










      return {
        data,
      };

    } catch (error) {

      console.log("+++++++++++++++++");
      console.log(error);
      console.log("+++++++++++++++++");
      return {};
    }




  }

  // async daftar_kota() {
  //   // initialize dependensi properties
  //   await this.initialize();

  //   const body = this.req.body;
  //   var limit = body.perpage;
  //   var page = 1;

  //   if (body.pageNumber != undefined && body.pageNumber !== '0' ) page = body.pageNumber;

  //   var where = { company_id : this.company_id };
        
  //   if (body.search != undefined && body.search != "") {
  //     where = {...where,...{ 
  //       [Op.or]: [{ name : { [Op.like]: "%" + body.search + "%" } }, { kode : { [Op.like]: "%" + body.search + "%" } }]
  //     }};
  //   }

  //   var sql = {};
  //   sql["limit"] = limit * 1;
  //   sql["offset"] = (page - 1) * limit;
  //   sql["order"] = [["id", "ASC"]];
  //   sql["attributes"] = [
  //     "id",
  //     "kode",
  //     "name",
  //     "updatedAt",
  //   ];
  //   sql["where"] = where;

  //   try {

  //     const query = await dbList(sql);
  //     const q = await Mst_kota.findAndCountAll(query.total);
  //     const total = await q.count;
  //     var data = [];
  //     if (total > 0) {
  //       await Mst_kota.findAll(query.sql).then(async (value) => {
  //         await Promise.all(
  //           await value.map(async (e) => {
  //             data.push({ 
  //               id : e.id, 
  //               kode : e.kode,
  //               name : e.name
  //             });
  //           })
  //         );
  //       });
  //     }

  //     return {
  //       data: data,
  //       total: total,
  //     };

  //   } catch (error) {
  //     return {};
  //   }
  // }

  // async infoKota(id, company_id) {
  //   try {
  //     var data = {};
  //     await Mst_kota.findOne({
  //         where: { id: id },
  //     }).then(async (e) => {
  //         if (e) {
  //             data["id"] = e.id;
  //             data["kode"] = e.kode;
  //             data["name"] = e.name;
  //         }
  //     });
     
  //     return data
  //   } catch (error) {
  //     return {}      
  //   }
  // } 
}

module.exports = Model_r;
