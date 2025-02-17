const bcrypt = require("bcryptjs");
const moment = require("moment");
const { sequelize, Company, Subscribtion_payment_history } = require("../../../models");

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

  async create_company(i) {

    console.log("____________________");
    console.log(i);
    console.log("____________________");
    // initialize general property
    await this.initialize();
    // define date
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    // insert process
    try {
      // insert new company
      const iC = await Company.create({
          code: i.company_code,
          kurs: "rp",
          logo: "",
          icon: "",
          company_name : i.company_name,
          email: i.email,
          type: "limited",
          verify_status: "unverified",
          verify_time: null,
          whatsapp_company_number : i.whatsapp_company_number,
          otp: i.otp_code,
          otp_expired_time: i.expired_time,
          invoice_logo: null,
          invoice_title: null,
          start_subscribtion: myDate,
          end_subscribtion: i.end_subscription,
          whatsapp_device_number: null,
          whatsapp_device_key: null,
          refresh_token: i.refresh_token,
          saldo: 0,
          markup_ppob: 0,
          username: i.username,
          password: i.hash_password,
          createdAt: myDate,
          updatedAt: myDate,
      },
      {
        transaction: this.t,
      });
      // insert subscribtion_payment_history
      await Subscribtion_payment_history.create({
        company_id: iC.id,
        order_id : i.order_id,
        amount: i.price,
        status: "process",    
        createdAt: myDate,
        updatedAt: myDate,
      },
      {
        transaction: this.t,
      });

    } catch (error) {
      this.state = false;
    }
  }


  
        
  // const body = this.req.body;
  // // insert to database
  // const i = await Bank_pemasukan.create(
  //   {
  //     bank_id : body.bank, 
  //     tipe : body.tipe,
  //     nomor_akun_bank : body.nomor_akun_bank, 
  //     nama_akun_bank : body.nama_akun_bank,
  //     createdAt: myDate,
  //     updatedAt: myDate,
  //   },
  //   {
  //     transaction: this.t,
  //   }
  // );
  // // write log message
  // this.message = `Menambahkan bank pemasukan baru dengan bank pemasukan id : ${i.id}`;
  //   // ✅ Simpan data ke database
  //   const newCompany = await Company.create({
  //     code: companyCode,
  //     kurs: "rp",
  //     logo: "",
  //     icon: "",
  //     company_name,
  //     email,
  //     type: "limited",
  //     verify_status: "unverified",
  //     verify_time: null,
  //     whatsapp_company_number,
  //     otp: otpRecord.otp_code,
  //     otp_expired_time: otpRecord.expired_time,
  //     invoice_logo: null,
  //     invoice_title: null,
  //     start_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
  //     end_subscribtion: endSubscription,
  //     whatsapp_device_number: null,
  //     whatsapp_device_key: null,
  //     refresh_token: refreshToken,
  //     saldo: 0,
  //     markup_ppob: 0,
  //     username,
  //     password: hashedPassword,
  //     start_date_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
  //     end_date_subscribtion: endSubscription,
  //     transaction_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   });

  //   await SubscriptionPaymentHistory.create({
  //     company_id: newCompany.id,
  //     order_id,
  //     amount: packagePrice,
  //     status: "pending",
  //   });

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
      // await write_log(this.req, this.t, {
      //   msg: this.message,
      // });
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
