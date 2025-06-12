const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// FUNGSI UNTUK MENGAMBIL DATA LIST
controllers.getDaftarTransaksiVisa = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.daftar_transaksi_visa(); // Ambil daftar tabungan dari model
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

//Controller untuk menangani penambahan transaksi visa baru.
controllers.addNewTransaksiVisa = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_cud = new Model_cud(req);
    await model_cud.add();
    const success = await model_cud.response();
    if (success) {
      res.status(201).json({
        success: true, 
        error: false,
        message: model_cud.message || "Data berhasil ditambahkan"
      });
    } else {
      throw new Error("Gagal menyimpan data transaksi visa.");
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

//Controller untuk menangani penghapusan transaksi visa berdasarkan ID.
controllers.deleteTransaksiVisa = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const { id } = req.params;
    const model_cud = new Model_cud(req);
    await model_cud.hapus(id);
    const success = await model_cud.response();

    if (success) {
      res.status(200).json({
        success: true,
        error: false,
        message: model_cud.message || "Data berhasil dihapus"
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: model_cud.message || "Gagal menghapus data transaksi visa."
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Impor Model_r dari transaksi_visa
const Model_r_transaksi_visa = require("../../transaksi_visa/models/model_r");

controllers.getAllCities = async (req, res) => {
  try {
    const model = new Model_r_transaksi_visa(req);
    const cities = await model.getAllCities(); 
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.getAllVisaTypes = async (req, res) => {
  try {
    const model = new Model_r_transaksi_visa(req);
    const visaTypes = await model.getAllVisaTypes(); 
    res.status(200).json({ success: true, data: visaTypes });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.updateTransaksiVisa = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const { id } = req.params;
    req.body.id = id; 

    const model_cud = new Model_cud(req);
    await model_cud.update(); 
    const success = await model_cud.response();

    if (success) {
      res.status(200).json({
        success: true,
        error: false,
        message: model_cud.message || "Data berhasil diperbarui"
      });
    } else {
      throw new Error(model_cud.message || "Gagal memperbarui data transaksi visa.");
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

module.exports = controllers;