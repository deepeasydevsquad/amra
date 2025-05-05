const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.addPinjaman = async (req, res) => {
  const model = new Model_cud(req);
  try {
    await model.createPeminjaman();
    const success = await model.response();

    if (success) {
      res.status(200).json({
        message: model.message || "Peminjaman berhasil dibuat",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message || "Gagal membuat peminjaman",
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat addPinjaman:", error);
    handleServerError(res, error);
  }
};

exports.daftarPinjaman = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftarPeminjaman();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
