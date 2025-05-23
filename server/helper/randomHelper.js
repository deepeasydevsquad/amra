// const { Transaction } = require("sequelize");
const { Deposit, Op } = require("../models");

const helper = {};

helper.randomString = async (length, chars) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

helper.menghasilkan_invoice_deposit = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Deposit.findOne({ where: { kode: rand } });
    if (!check) condition = false;
  }
  return rand;
}

// helper.generated_kode_nominal_donasi  = async () => {
//   var rand = 0;
//   let condition = true;
//   while (condition) {
//     rand = await helper.randomString(3, "0123456789");
//     check = await Riwayat_donasi.findOne({ where: { kode: rand, status: 'process' } });
//     if (!check) condition = false;
//   }
//   return rand;
// }

// helper.generated_kode_nominal_infak  = async () => {
//   var rand = 0;
//   let condition = true;
//   while (condition) {
//     rand = await helper.randomString(3, "0123456789");
//     check = await Pemasukan.findOne({ where: { kode: rand, tipe: 'infaq', status: 'process' } });
//     if (!check) condition = false;
//   }
//   return rand;
// }

// helper.generated_kode_nominal_zakat  = async () => {
//   var rand = 0;
//   let condition = true;
//   while (condition) {
//     rand = await helper.randomString(3, "0123456789");
//     check = await Pemasukan.findOne({ where: { kode: rand, tipe: {[Op.ne] : "infaq"}, status: 'process' } });
//     if (!check) condition = false;
//   }
//   return rand;
// }

// helper.generate_pengguna_code = async () => {
//   var rand = 0;
//   let condition = true;
//   while (condition) {
//     rand = await helper.randomString(61, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
//     check = await Member.findOne({ where: { kode: rand } });
//     if (!check) condition = false;
//   }
//   return rand;
// }

// helper.generate_member_code = async () => {
//   var rand = 0;
//   let condition = true;
//   while (condition) {
//     rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
//     check = await Member.findOne({ where: { kode: rand } });
//     if (!check) condition = false;
//   }
//   return rand;
// };

// helper.gen_access_code = async ( surveyor_id ) => {
//   var surveyorId = JSON.parse(surveyor_id);
//   var list_code = [];
//   for ( let i = 0; i < surveyorId.length ; i++) {
//     let condition = true;
//     var rand = 0;
//     while (condition) {
//       rand = await helper.randomString(150, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
//       check = await Survey_kegiatan.findOne({ where: { access_code: rand } });
//       if (!check) condition = false;
//     }
//     list_code[i] = rand;
//   }
//   return list_code;
// }

// helper.gen_member_code = async ( ) => {

// }
 
module.exports = helper;
