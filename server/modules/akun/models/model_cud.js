const Model_r = require("./model_r");
const { sequelize, Op, Akun_secondary, Saldo_akun, Jurnal, Akun_primary, Division, Periode } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // Tambah Akun
  async add() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {

      const primary_id = body.primary_id;
      const prefix = body.prefix;
      const nomor_akun = prefix + body.nomor;
      const nama_akun = body.nama;
      const saldo = body.saldo;

      // insert process
      const insert = await Akun_secondary.create(
        {
          company_id : this.company_id, 
          akun_primary_id : primary_id,
          nomor_akun: nomor_akun,
          nama_akun: nama_akun,
          tipe_akun: 'tambahan',
          path: '',
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      if(saldo > 0 ) {
        // insert ke saldo
        await Saldo_akun.create(
          {
            division_id : this.division_id, 
            akun_secondary_id : insert.id,
            saldo: saldo,
            periode: 0,
            createdAt: myDate,
            updatedAt: myDate,
          },
          {
            transaction: this.t,
          }
        );
      }
      // write log message
      this.message = `Menambahkan Akun Baru dengan Nama Akun : ${body.nama}, Nomor Akun : ${nomor_akun} dan ID Akun : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // update Akun
  async update() {

    console.log("________________________");
    console.log("_______Update___________");
    console.log("________________________");

    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const primary_id = body.primary_id;
    const prefix = body.prefix;
    const nomor_akun = prefix + body.nomor;
    const nama_akun = body.nama;
    const saldo = body.saldo;

    try {
      // delete saldo
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: body.id,
            division_id: this.division_id, 
            periode: 0
          },
        },
        {
          transaction: this.t,
        }
      );

      // insert process
      const update = await Akun_secondary.update(
        {
          nomor_akun: nomor_akun,
          nama_akun: nama_akun,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          where: { id: body.id, company_id : this.company_id,  },
        },
        {
          transaction: this.t,
        }
      );

      console.log('~~~~~~~~~~~~~Saldo');
      console.log('~~~~~~~~~~~~~Saldo');
      console.log('~~~~~~~~~~~~~Saldo');
      console.log(saldo);
      console.log('~~~~~~~~~~~~~Saldo');
      console.log('~~~~~~~~~~~~~Saldo');

      if(saldo > 0 ) {

        console.log('~~~~~~~~~~~~~');
        console.log(this.division_id);
        console.log(body.id);
        console.log('~~~~~~~~~~~~~');
        // insert ke saldo
        await Saldo_akun.create(
          {
            division_id : this.division_id, 
            akun_secondary_id : body.id,
            saldo: saldo,
            periode: 0,
            createdAt: myDate,
            updatedAt: myDate,
          },
          {
            transaction: this.t,
          }
        );
      }

      // write log message
      this.message = `Memperbaharui data akun ID Akun : ${body.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // delete Akun
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // delete saldo
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: body.id,
            division_id: this.division_id, 
            periode: 0
          },
        },
        {
          transaction: this.t,
        }
      );
      // delete akun seconday
      await Akun_secondary.destroy(
        {
          where: {
            id: body.id,
            company_id : this.company_id
          },
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menghapus Akun dengan ID Aakun : ${body.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  async update_saldo() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const saldo = body.saldo;
    try {
      // delete saldo
      await Saldo_akun.destroy(
        {
          where: {
            akun_secondary_id: body.id,
            division_id : this.division_id, 
            periode: 0
          },
        },
        {
          transaction: this.t,
        }
      );
      // insert new saldo
      await Saldo_akun.create(
        {
          division_id : this.division_id, 
          akun_secondary_id : body.id,
          saldo: saldo,
          periode: 0,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      // write log message
      this.message = `Mengupdate saldo akun dengan ID Akun : ${body.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  async tutup_buku() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    try {

      var division = [];
      await Division.findAll({ where : { company_id : this.company_id }}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            division.push(e.id);
          })
        );
      });

      var akun_primary = {};
      await Akun_primary.findAll().then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            akun_primary[e.id] = { sn: e.sn, pos : e.pos };
          })
        );
      });

      var akun_secondary_id = {};
      await Akun_secondary.findAll({ 
        where : { 
          company_id : this.company_id,
        }
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
             akun_secondary_id[e.nomor_akun] = e.id; 
          })
        );
      });

      var saldo_awal = {};
      await Saldo_akun.findAll({ 
        include: { 
          required : true, 
          model: Akun_secondary 
        }, 
        where : { 
          division_id : { [Op.in] : division },
          periode : 0 
        }
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            if(saldo_awal[e.division_id] === undefined ) {
              saldo_awal = {...saldo_awal,...{[e.division_id] : { [e.Akun_secondary.nomor_akun] : e.saldo } } };
            }else{
              if(saldo_awal[e.division_id][e.Akun_secondary.nomor_akun] === undefined ) {
                saldo_awal[e.division_id] = {...saldo_awal[e.division_id],...{ [e.Akun_secondary.nomor_akun] : e.saldo } };
              }else{
                saldo_awal[e.division_id][e.Akun_secondary.nomor_akun] = saldo_awal[e.division_id][e.Akun_secondary.nomor_akun] + e.saldo;
              }
            }
          })
        );
      });

      var saldo_jurnal = {};
      await Jurnal.findAll({ where : { division_id : { [Op.in] : division }, periode_id : 0 }}).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              // info akun
              var infAkunDebet =  akun_primary[e.akun_debet.toString().charAt(0)];
              var infAkunKredit =  akun_primary[e.akun_kredit.toString().charAt(0)];

              if( infAkunDebet.sn == 'D') {
                if(saldo_jurnal[e.division_id] === undefined ) {
                  saldo_jurnal = {...saldo_jurnal,...{[e.division_id] : { [e.akun_debet] : ( e.saldo + 0 ) } } };
                }else{
                  if( saldo_jurnal[e.division_id][e.akun_debet] === undefined ) {
                    saldo_jurnal[e.division_id] = {...saldo_jurnal[e.division_id],...{[e.akun_debet] : (e.saldo + 0)}}
                  }else{
                    saldo_jurnal[e.division_id][e.akun_debet] = saldo_jurnal[e.division_id][e.akun_debet] + e.saldo;
                  }
                }
              }else if ( infAkunDebet.sn == 'K' ) {
                if(saldo_jurnal[e.division_id] === undefined ) {
                  saldo_jurnal = {...saldo_jurnal,...{[e.division_id] : { [e.akun_debet] : ( 0 - e.saldo ) } } };
                }else{
                  if( saldo_jurnal[e.division_id][e.akun_debet] === undefined ) {
                    saldo_jurnal[e.division_id] = {...saldo_jurnal[e.division_id],...{[e.akun_debet] : ( 0 - e.saldo )}}
                  }else{
                    saldo_jurnal[e.division_id][e.akun_debet] = saldo_jurnal[e.division_id][e.akun_debet] - e.saldo;
                  }
                }
              }

              if( infAkunKredit.sn == 'D') {
                if(saldo_jurnal[e.division_id] === undefined ) {
                  saldo_jurnal = {...saldo_jurnal,...{[e.division_id] : { [e.akun_kredit] : ( 0 - e.saldo ) } } };
                }else{
                  if( saldo_jurnal[e.division_id][e.akun_kredit] === undefined ) {
                    saldo_jurnal[e.division_id] = {...saldo_jurnal[e.division_id],...{[e.akun_kredit] : (0 - e.saldo)}}
                  }else{
                    saldo_jurnal[e.division_id][e.akun_kredit] = saldo_jurnal[e.division_id][e.akun_kredit] - e.saldo;
                  }
                }
              }else if ( infAkunKredit.sn == 'K' ) {
                if(saldo_jurnal[e.division_id] === undefined ) {
                  saldo_jurnal = {...saldo_jurnal,...{[e.division_id] : { [e.akun_kredit] : ( e.saldo + 0 ) } } };
                }else{
                  if( saldo_jurnal[e.division_id][e.akun_kredit] === undefined ) {
                    saldo_jurnal[e.division_id] = {...saldo_jurnal[e.division_id],...{[e.akun_debet] : ( e.saldo + 0 )}}
                  }else{
                    saldo_jurnal[e.division_id][e.akun_kredit] = saldo_jurnal[e.division_id][e.akun_kredit] + e.saldo;
                  }
                }
              }

            })
          );
      });

      var saldo_akhir = {};
      for( let x in division ) {
        if( saldo_awal[division[x]] !== undefined ) {
          for( let y in saldo_awal[division[x]] ) {
            if( saldo_akhir[division[x]] === undefined ) {
              saldo_akhir =  {...saldo_akhir,...{[division[x]] : { [y] : saldo_awal[division[x]][y] } } };
            }else{
              if( saldo_akhir[division[x]][y] === undefined ) {
                saldo_akhir[division[x]] = {...saldo_akhir[division[x]],...{[y] : saldo_awal[division[x]][y] } };
              }else{
                saldo_akhir[division[x]][y] = saldo_akhir[division[x]][y] + saldo_awal[division[x]][y];
              }
            }
          }
        }

        if( saldo_jurnal[division[x]] !== undefined ) {
          for( let y in saldo_jurnal[division[x]] ) {
            if( saldo_akhir[division[x]] === undefined ) {
              saldo_akhir =  {...saldo_akhir,...{[division[x]] : { [y] : saldo_jurnal[division[x]][y] } } };
            }else{
              if( saldo_akhir[division[x]][y] === undefined ) {
                saldo_akhir[division[x]] = {...saldo_akhir[division[x]],...{[y] : saldo_jurnal[division[x]][y] } };
              }else{
                saldo_akhir[division[x]][y] = saldo_akhir[division[x]][y] + saldo_jurnal[division[x]][y];
              }
            }
          }
        }
      }

      // create periode baru
      const insert = await Periode.create(
        {
          company_id : this.company_id,
          name : body.nama_periode,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      // update semua saldo akun yang periodenya 0 ke periode terbaru
      for( let p in division ) {
        await Saldo_akun.update(
          {
            periode: insert.id,
            updatedAt: myDate,
          },
          {
            where: { periode: 0, division_id: division[p]},
          },
          {
            transaction: this.t,
          }
        );
      }

      // update semua periode jurnal dari periode 0 ke periode terbaru
      await Jurnal.update(
        {
          periode_id: insert.id,
          updatedAt: myDate,
        },
        {
          where: { periode_id: 0, division_id : { [Op.in] : division } },
        },
        {
          transaction: this.t,
        }
      );

      for( let u in saldo_akhir ) {
        for( let i in saldo_akhir[u] ) {
          await Saldo_akun.create(
            {
              division_id : u,
              akun_secondary_id : akun_secondary_id[i],
              saldo : saldo_akhir[u][i],
              periode : 0,
              createdAt: myDate,
              updatedAt: myDate,
            },
            {
              transaction: this.t,
            }
          );
        }
      }

      // write log message
      this.message = `Menutup Buku Akuntasi pada periode ${body.nama_periode}`;
    } catch (error) {
      this.state = false;
    }
  }

  async kembalikan_buku () {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    try {
      // get last periode

      // delete jurnal

      // delete saldo 


      //



      this.message = `Membuka Buku Akuntasi pada periode ${body.nama_periode}`;
    } catch (error) {
      this.state = false;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      // commit
      await this.t.commit();
      return true;
    } else {
      // rollback
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
