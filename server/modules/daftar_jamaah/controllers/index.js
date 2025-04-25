const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.getJamaah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.daftar_jamaah();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.addJamaah = async (req, res) => {

  if (!(await handleValidationErrors(req, res))) return;
  
  try {
    const model = new Model_cud(req);
    await model.tambahJamaah(); // insert data

    const success = await model.response(); // ⛔ penting buat commit/rollback

    res.status(success ? 200 : 500).json({
      success,
      message: model.message,
    });
  } catch (error) {
    handleServerError(res, error.message);
  }
};
exports.editJamaah = async (req, res) => {
  try {
    const model = new Model_cud(req);
    await model.editJamaah(); // insert data

    const success = await model.response(); // ⛔ penting buat commit/rollback

    res.status(success ? 200 : 500).json({
      success,
      message: model.message,
    });
  } catch (error) {
    handleServerError(res, error.message);
  }
};
exports.deleteJamaah = async (req, res) => {
  try {
    const model = new Model_cud(req);
    await model.deleteJamaah(); // insert data

    const success = await model.response(); // ⛔ penting buat commit/rollback

    res.status(success ? 200 : 500).json({
      success,
      message: model.message,
    });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.downloadJamaah = async (req, res) => {
  try {
    const model = new Model_r(req);
    await model.download_jamaah_excel(req, res); 
  } catch (error) {
    handleServerError(res, error.message);
  }
};
