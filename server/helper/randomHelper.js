const {
  Deposit,
  Peminjaman,
  Riwayat_pembayaran_peminjaman,
  Fee_agen,
  Op,
  Kas_keluar_masuk,
  Pembayaran_gaji,
  Item_fasilitas,
  Handover_fasilitas,
  Handover_fasilitas_paket,
  Transaction_fasilitas
} = require("../models");

const helper = {};

helper.randomString = async (length, chars) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

helper.generateInvoiceHandoverFasilitas = async (company_id) => {
    var rand = 0;
    let condition = true;
    while (condition) {
      rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      check1 = await Handover_fasilitas.findOne({ where: { invoice: rand }, include: { model: Tabungan, required: true, include : { model: Division, required: true, where: { company_id: company_id}}} });
      check2 = await Handover_fasilitas_paket.findOne({ where: { invoice: rand }, include: { model: Paket_transaction, required: true, include: { model: Division, required: true,  where: { company_id: this.company_id } }} });
      check3 = await Transaction_fasilitas.findOne({ where: { invoice: rand, company_id: this.company_id } });
      if (!check1 & !check2 && !check3) condition = false;
    }

    return rand;
}

helper.menghasilkan_invoice_deposit = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Deposit.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
};

helper.menghasilkan_nomor_registrasi_peminjaman = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Peminjaman.findOne({
      where: { register_number: rand },
      attributes: ["id"], // <- ini biar gak ikut ambil company_id
    });

    if (!check) condition = false;
  }
  console.log("rand =>", rand);
  return rand;
};

helper.menghasilkan_invoice_riwayat_pembayaran_peminjaman = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Riwayat_pembayaran_peminjaman.findOne({
      where: { invoice: rand },

      attributes: ["id"],
    });
    if (!check) condition = false;
  }
  return rand;
};

helper.menghasilkan_invoice_fee_agen = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Fee_agen.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
};

helper.menghasilkan_invoice_kas_keluar_masuk = async (division_id) => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Kas_keluar_masuk.findOne({
      where: { invoice: rand, division_id: { [Op.in]: division_id } },
    });
    if (!check) condition = false;
  }
  return rand;
};

helper.menghasilkan_invoice_pembayaran_gaji = async () => {
  var rand = 0;
  let condition = true;
  while (condition) {
    rand = await helper.randomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    check = await Pembayaran_gaji.findOne({ where: { invoice: rand } });
    if (!check) condition = false;
  }
  return rand;
};

helper.generate_item_code = async () => {
  let item_code = "";
  let exists = true;

  while (exists) {
    item_code = await helper.randomString(
      10,
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    const check = await Item_fasilitas.findOne({ where: { item_code } });
    exists = !!check;
  }

  return item_code;
};

module.exports = helper;
