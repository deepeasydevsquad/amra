const { Fasilitas_paket_la, Paket_la, Detail_fasilitas_paket_la } = require("../models");

const validation = {};

validation.check_id_detail_fasilitas_paket_la = async (value, { req }) => {
  try {
    const data = await Detail_fasilitas_paket_la.findOne({
      where: { id: value },
    });
    if (!data) {
      return Promise.reject("ID Detail Fasilitas Paket LA tidak ditemukan.");
    }
    return true;
  } catch (error) {
    return Promise.reject("Terjadi kesalahan saat validasi ID Detail Fasilitas Paket LA.");
  }
};

validation.check_invoice_fasilitas_paket_la = async (value, { req }) => {
  try {
    const data = await Fasilitas_paket_la.findOne({
      where: { invoice: value },
    });
    if (!data) {
      return Promise.reject("ID Fasilitas Paket LA tidak ditemukan.");
    }
    return true;
  } catch (error) {
    return Promise.reject("Terjadi kesalahan saat validasi ID Fasilitas Paket LA.");
  }
};

validation.check_register_number = async (value, { req }) => {
  try {
    const data = await Paket_la.findOne({
      where: { register_number: value },
    });
    if (!data) {
      return Promise.reject("Nomor Registrasi Paket LA tidak ditemukan.");
    }
    return true;
  } catch (error) {
    return Promise.reject("Terjadi kesalahan saat validasi Nomor Registrasi Paket LA.");
  }
};

module.exports = validation;
