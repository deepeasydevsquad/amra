const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

// Generate Unique Nomor Invoice
controllers.generateNomorInvoice = async (req, res) => {
  try {
    const model_cud = new Model_cud(req);
    const response = await model_cud.generateNomorInvoice();
    return res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Generate Unique Nomor Register
controllers.generateNomorRegister = async (req, res) => {
  try {
    const model_cud = new Model_cud(req);
    const response = await model_cud.generateNomorRegister();
    return res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// Menambahkan tiket baru
controllers.addTiket = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_cud = new Model_cud(req);
    const add = await model_cud.add();
    return res.status(200).json(add);
  } catch (error) {
    handleServerError(res, error.message);
  }
};
// get all tickets transactions
controllers.getTicketTransactions = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_r = new Model_r(req);
    const data = await model_r.ticket_transactions();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.getAirlines = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const data = await model_r.getAirlines();
    res.status(200).json({ error: false, data: data });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.add_pembayaran_ticket = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.add_pembayaran_tikects();

    if (await model.response()) {
      res.status(200).json({
        message: model.message || "Transaksi berhasil dibuat",
        invoice: model.invoice,
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message || "Gagal membuat Transaksi",
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat Transaksi Fee:", error);
    handleServerError(res, error);
  }
};

controllers.detail_ticket = async (req, res) => {
  try {
    const data = await new Model_r(req).get_detail_tiket();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.daftar_customer = async (req, res) => {
  try {
    const data = await new Model_r(req).daftar_kostumer();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

controllers.daftar_paket = async (req, res) => {
  try {
    const data = await new Model_r(req).daftar_paket();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

module.exports = controllers;
