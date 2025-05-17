const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError, error_msg } = require("../../../helper/handleError");

const controllers = {};

// Mendapatkan daftar tabungan
controllers.get_daftar_tabungan_umrah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.daftar_tabungan_umrah(); // Ambil daftar tabungan dari model
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Menambahkan tabungan baru
controllers.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    const invoice = await model_cud.add();
    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Tabungan Umrah Baru berhasil ditambahkan.',
        data: { invoice: invoice },
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Tabungan Umrah Baru Gagal Ditambahkan.',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Update tabungan
controllers.updateTargetPaket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.updateTargetPaket();

    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Target Paket Tabungan Umrah berhasil diupdate',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Target Paket Tabungan Umrah gagal diupdate',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}


// Hapus tabungan
controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Tabungan Umrah berhasil dihapus.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Tabungan Umrah Gagal Dihapus.',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Mengambil daftar Jamaah Tabungan Umrah
controllers.getJamaahTabunganUmrah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.getJamaahTabunganUmrah();
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Mengambil daftar Paket Tabungan Umrah
controllers.getPaketTabunganUmrah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.getPaketTabunganUmrah();
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Mengambil daftar Agen berdasarkan ID*/
controllers.getAgenById = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.getAgenById();
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

module.exports = controllers;

