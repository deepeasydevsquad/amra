const Model_r = require("../models/model_r");
// const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// Mendapatkan status card untuk beranda utama
controllers.statusCard = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.statusCard(); // Ambil status card dari model
    res.status(200).json({ error: false, data: feedBack });
  } catch (error) {
    handleServerError(res, error.message);
  }
}

// Mendapatkan daftar jamaah terdaftar
controllers.daftarJamaah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.daftarJamaah(); // Ambil daftar jamaah dari model
    res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Mendapatkan daftar permintaan deposit member
// controllers.daftarPermintaanDepositMember = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_r = new Model_r(req);
//     const feedBack = await model_r.daftarPermintaanDepositMember(); // Ambil daftar deposit member dari model
//     res.status(200).json({ error: false, data : feedBack.data, total : feedBack.total });
//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

module.exports = controllers;

