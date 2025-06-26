const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// Mendapatkan daftar transaksi paket
controllers.getDaftarManifestPaket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.daftarManifestPaket(); // Ambil daftar transaksi paket dari model
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Update manifest paket
controllers.updateManifestPaket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.updateManifestPaket();

    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Manifest paket berhasil diupdate',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Manifest paket gagal diupdate',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

// Mendapatkan info update manifest
controllers.getInfoUpdaterManifestPaket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.getInfoUpdaterManifestPaket(); // Ambil data info update manifest dari model
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(error, error.message)
  }
}

// Download manifest paket
controllers.downloadManifestPaket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    await model_r.downloadManifestPaket(res);
  } catch (error) {
    handleServerError(res, error.message);
  }
}

module.exports = controllers;

