const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

exports.getPengguna = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.daftar_pengguna();
    res.status(200).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.addPengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.tambahPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// ✅ KELUARKAN FUNGSI INI DARI DALAM `addPengguna`
exports.editPengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.editPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};

exports.deletePengguna = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.hapusPengguna();
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    handleServerError(res, error.message);
  }
};


exports.get_member = async (req, res) => {
  try {

    const model = new Model_r(req);
    const data = await model.get_member();
    if( data.length > 0 ) {
      res.status(200).json({ 
        error: false, 
        error_message: 'Data member berhasil ditemukan', 
        data : data 
      });
    }else{
      res.status(400).json({ 
        error: true, 
        error_message: 'Data member tidak ditemukan', 
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

exports.get_grup = async (req, res) => {
  try {

    const model = new Model_r(req);
    const data = await model.get_grup();
    if( data.length > 0 ) {
      res.status(200).json({ 
        error: false, 
        error_message: 'Data grup berhasil ditemukan', 
        data : data 
      });
    }else{
      res.status(400).json({ 
        error: true, 
        error_message: 'Data grup tidak ditemukan', 
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}
