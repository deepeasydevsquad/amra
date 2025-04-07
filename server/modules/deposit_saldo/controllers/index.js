const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

exports.getDeposit = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftarDeposit();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.getCompany = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.dataCompany();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.addDeposit = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.tambahDeposit();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
exports.infoDeposit = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.infoDeposit();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
