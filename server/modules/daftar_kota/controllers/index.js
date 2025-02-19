const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// **Mendapatkan daftar kota**
controllers.get_daftar_kota = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const data = await model_r.daftar_kota(); // Ambil daftar kota dari model
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// **Menambahkan kota baru**
controllers.create_daftar_kota = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const { company_id, kode, name } = req.body;
    
    if (!company_id) {
      return res.status(400).json({ error: true, message: "Company ID tidak ditemukan." });
    }

    const model_cud = new Model_cud(req);
    const data = await model_cud.create_daftar_kota({ company_id, kode, name });

    res.status(201).json({ error: false, message: "Kota berhasil ditambahkan", data });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// **Update kota**
controllers.update_daftar_kota = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const { company_id, kode, name } = req.body;
    const { id } = req.params; // Ambil ID dari params

    if (!company_id) {
      return res.status(400).json({ error: true, message: "Company ID tidak ditemukan." });
    }

    const model_cud = new Model_cud(req);
    const result = await model_cud.update_daftar_kota({ id, company_id, kode, name });

    if (result.error) {
      return res.status(400).json(result); // Tangani error dari CUD
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error di Controller:", error);
    handleServerError(res, error.message);
  }
};

// **Hapus kota**
controllers.delete_daftar_kota = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id } = req.body; // Ambil dari req.body sesuai router

    if (!company_id) {
      return res.status(400).json({ error: true, message: "Company ID tidak ditemukan." });
    }

    const model_cud = new Model_cud(req);
    await model_cud.delete_daftar_kota({ id, company_id });

    res.status(200).json({ error: false, message: "Kota berhasil dihapus." });
  } catch (error) {
    handleServerError(res, error.message);
  }
};

module.exports = controllers;
