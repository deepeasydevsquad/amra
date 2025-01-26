const bcrypt = require("bcryptjs");
const moment = require("moment");
const { sequelize, Company } = require("../../../db/models");
const { write_log } = require("../../../helpers/administrator/write_log");
// const { generate_member_code } = require('../../../helpers/random');

class Model_cud {
  constructor(req) {
    this.req = req;
    this.t;
    this.state;
  }

  async initialize() {
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

//   async add() {
//     // initialize general property
//     await this.initialize();
//     const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//     // insert process
//     try {
//       const body = this.req.body;
//       const kode_member = await generate_member_code();
//       var password = "12345";
//       if (body.password !== "") {
//         password = body.password;
//       }
//       const saltRounds = 10;
//       await bcrypt
//       .genSalt(saltRounds)
//       .then((salt) => {
//         return bcrypt.hash(password, salt);
//       })
//       .then(async (hash) => {
//         var data = {
//           tipe  : body.tipe,
//           kode  : kode_member, 
//           fullname : body.fullname, 
//           whatsapp_number : body.nomor_whatsapp, 
//           username : body.username,
//           password : hash,
//           status : 'verified', 
//           createdAt: myDate,
//           updatedAt: myDate,
//         };
//         if(body.kecamatan == '11'){
//           data = {...data,...{alamat : body.alamat, desa_id : null } };
//         }else{
//           data = {...data,...{alamat : '', desa_id : body.desa } };
//         }

//         if( body.tipe === 'perorangan') {
//           data = {...data,...{nomor_ktp : body.nomor_ktp, nomor_kk : body.kartu_keluarga, birth_date : body.birth_date } };
//         }
                 
//         // insert process
//         const i = await Member.create(
//           data,
//           {
//             transaction: this.t,
//           }
//         );
//         // write log message
//         this.message = `Menambahkan member baru dengan nama : ${body.fullname}, dengan Member ID : ${i.id}`;
//       });
//     } catch (error) {
//       console.log("error");
//       console.log(error);
//       console.log("error");
//       this.state = false;
//     }
//   }

//   async delete() {
//     // initialize general property
//     await this.initialize();
//     const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//        // insert process
//     try {
//       const body = this.req.body;
//       // delete member
//       await Member.destroy(
//         {
//           where: {
//             id: body.id,
//           },
//         },
//         {
//           transaction: this.t,
//         }
//       );
//       // write log message
//       this.message = `Menghapus member dengan ID : ${body.id}`;
//     } catch (error) {
//       this.state = false;
//     }
//   }
  
//   async update() {
//     // initialize general property
//     await this.initialize();
//     const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//     const body = this.req.body;
//     // insert process
//     try {
//       if(body.password !== undefined && body.password !== '' ) {
//         const saltRounds = 10;
//         await bcrypt
//         .genSalt(saltRounds)
//         .then((salt) => {
//           return bcrypt.hash(password, salt);
//         })
//         .then(async (hash) => {
//           var data = { 
//             tipe  : body.tipe,
//             fullname : body.fullname, 
//             whatsapp_number : body.nomor_whatsapp,
//             username : body.username,
//             password : hash,
//             updatedAt: myDate,
//           };

//           if(body.kecamatan == '11'){
//             data = {...data,...{alamat : body.alamat, desa_id : null } };
//           }else{
//             data = {...data,...{alamat : '', desa_id : body.desa } };
//           }

//           if( body.tipe === 'perorangan') {
//             data = {...data,...{nomor_ktp : body.nomor_ktp, nomor_kk : body.kartu_keluarga, birth_date : body.birth_date } };
//           }

//           await Member.update(
//             data,
//             {
//               where: { id: body.id },
//             },
//             {
//               transaction: this.t,
//             }
//           );
//         });
//       }else{
//         var data = { 
//           tipe  : body.tipe,
//           fullname : body.fullname, 
//           whatsapp_number : body.nomor_whatsapp,
//           username : body.username,
//           updatedAt: myDate,
//         };

//         if(body.kecamatan == '11') {
//           data = {...data,...{alamat : body.alamat, desa_id : null } };
//         }else{
//           data = {...data,...{alamat : '', desa_id : body.desa } };
//         }

//         if( body.tipe === 'perorangan') {
//           data = {...data,...{nomor_ktp : body.nomor_ktp, nomor_kk : body.kartu_keluarga, birth_date : body.birth_date } };
//         }

//         await Member.update(
//           data,
//           {
//             where: { id: body.id },
//           },
//           {
//             transaction: this.t,
//           }
//         );
//       }
//       // write log message
//       this.message = `Menambahkan member baru dengan nama : ${body.fullname}, dengan Member ID : ${body.id}`;
//     } catch (error) {
//       this.state = false;
//     }
//   }

  async response() {
    if (this.state) {
      await write_log(this.req, this.t, {
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
