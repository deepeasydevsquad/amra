const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

// **Mendapatkan daftar Agen**
exports.getAgen = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftar_Agen();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
exports.addAgen = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.tambahAgen();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
exports.deleteAgen = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.hapusAgen();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
