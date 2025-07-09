
const { Deposit, Peminjaman, Riwayat_pembayaran_peminjaman, Fee_agen, Op, Kas_keluar_masuk } = require("../models");

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
    check = await Deposit.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
}

helper.menghasilkan_nomor_registrasi_peminjaman = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Peminjaman.findOne({ where: { register_number: rand } });
    if (!check) condition = false;
  }
  return rand;
}

helper.menghasilkan_invoice_riwayat_pembayaran_peminjaman = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Riwayat_pembayaran_peminjaman.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
}

helper.menghasilkan_invoice_fee_agen = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Fee_agen.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
}
 

helper.menghasilkan_invoice_kas_keluar_masuk = async ( division_id ) => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Kas_keluar_masuk.findOne({ where: { invoice: rand, division_id: { [Op.in] : division_id  }  } });
    if (!check) condition = false;
  }
  return rand;
}
module.exports = helper;
