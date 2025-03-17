const Model_r = require("../models/model_r"); // Impor class Model_r
const { handleServerError } = require("../../../helper/handleError");

exports.get_sistem_log = async (req, res) => {
  try {
    const modelRInstance = new Model_r(); // Buat instance dari Model_r
    const logs = await modelRInstance.getTravelLogs(); // Panggil method getTravelLogs

    res.status(200).json({
      error: false,
      data: logs, // Data log yang sudah diformat
      total: logs.length, // Jumlah total log
    });
  } catch (error) {
    handleServerError(res, error.message); // Handle error
  }
};
