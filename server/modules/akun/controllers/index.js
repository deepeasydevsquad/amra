const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleValidationErrors2, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// **Mendapatkan daftar kota**
controllers.filter_akun = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.filter_akun(); // Ambil daftar akun dari model

    // console.log("--------------------xxxxxxxxx");
    // console.log(feedBack);
    // console.log("--------------------xxxxxxxxx");
    res.status(200).json({ error: false, data : feedBack });
  } catch (error) {
    console.log("--------------------xxxxxxxxx");
    console.log(error);
    console.log("--------------------xxxxxxxxx");
    handleServerError(res, error.message);
  }
};

controllers.get_daftar_akun = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_daftar_akun(); // Ambil daftar akun dari model

    // console.log("--------------------xxxxxxxxx");
    // console.log(feedBack);
    // console.log("--------------------xxxxxxxxx");
    res.status(200).json({ error: false, data : feedBack.data });
  } catch (error) {
    handleServerError(res, error.message);
  }
}

controllers.check_akun = async (req, res) => {
  if (!(await handleValidationErrors2(req, res))) return;

  try {
    res.status(200).json({ error: false });
  } catch (error) {
    handleServerError(res, error.message);
  }
}

controllers.add = async (req, res) => {

  if (!(await handleValidationErrors2(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add();
    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Akun Baru berhasil ditambahkan.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Akun Baru Gagal Ditambahkan.',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

controllers.edit = async (req, res) => {
  
  if (!(await handleValidationErrors2(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update();
    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Data Akun berhasil diupdate.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Data akun gagal diupdate.',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

controllers.delete = async ( req, res) => {

  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();
    // get response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Akun berhasil dihapus.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Akun gagal dihapus.',
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
}

// // **Menambahkan kota baru**
// controllers.add = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.add();
//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Kota Baru berhasil ditambahkan.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Kota Baru Gagal Ditambahkan.',
//       });
//     }
//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

// // **Update kota**
// controllers.update = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.update();
//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Kota berhasil Diupdate.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Kota Gagal Diupdate.',
//       });
//     }

//   } catch (error) {
//     console.error("Error di Controller:", error);
//     handleServerError(res, error.message);
//   }
// };

// // **Hapus kota**
// controllers.delete = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.delete();

//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Kota berhasil dihapus.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Kota Gagal Dihapus.',
//       });
//     }
//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

module.exports = controllers;
