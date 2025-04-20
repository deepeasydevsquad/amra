const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");
const Model_r = require("../models/model_r");

exports.get = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftar_member();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.getType = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.getTipe();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.add();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.update();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const model = new Model_cud(req);

    const data = await model.delete();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
