const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

exports.getPengguna = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftar_pengguna();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.addPengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.tambahPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// ✅ KELUARKAN FUNGSI INI DARI DALAM `addPengguna`
exports.editPengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.editPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.deletePengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.hapusPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
