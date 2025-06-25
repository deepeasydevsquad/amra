const Model_r = require("../models/model_r");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.daftar_agen = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftar_detail_agen();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
