const Model_r = require("../models/model_r");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.invoice_deposit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataInvoiceDeposit();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.invoice_paket_la = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataInvoicePaketLa();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.kwitansi_terakhir = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataKwitansiTerakhir();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.invoice_pembayaran_perbulan = async (req, res) => {
  console.log(">> Controller jalan, invoice:", req.params.invoice);
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.kwitansiPembayaranPerbulan();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

exports.kwitansi_tabungan_umrah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataKwitansiTabunganUmrah();
    if (  Object.keys(data).length > 0 ){
      res.status(200).json({ error : false, err_msg : 'Data ditemukan', data });
    }else{
      res.status(400).json({ error : true, err_msg : 'Data tidak ditemukan' });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

exports.cek_kwitansi_tabungan_umrah = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.checkKwitansiTabunganUmrah();
    if (  Object.keys(data).length > 0 ){
      res.status(200).json({ error : false, err_msg : 'Data ditemukan', data });
    }else{
      res.status(400).json({ error : true, err_msg : 'Data tidak ditemukan' });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

exports.kwitansi_handover_fasilitas = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataKwitansiHandoverFasilitas();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.kwitansi_handover_barang = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataKwitansiHandoverBarang();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.kwitansi_pengembalian_handover_barang = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.dataKwitansiPengembalianHandoverBarang();
    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.kwitansi_visa = async (req, res) => {
  if (!req.params.invoice || req.params.invoice === 'undefined') {
    return res.status(400).json({ error: true, err_msg: "Parameter invoice tidak valid." });
  }


  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.KwitansiVisa(); 

    if (Object.keys(data).length > 0) {
      res.status(200).json({ error: false, err_msg: "Data ditemukan", data });
    } else {
      res.status(400).json({ error: true, err_msg: "Data kwitansi visa tidak ditemukan" });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};