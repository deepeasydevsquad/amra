const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

// list agen
exports.list = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.list();
    res.status(200).json(data);
  } catch (error) {
    console.log("_____DDDDD_______");
    console.log(error);
    console.log("_____DDDDD_______");
    handleServerError(res, error.message);
  }
};

exports.add_stock = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.tambah_stok();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Fasilitas berhasil diupdate.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Fasilitas gagal diupdate.",
      });
    }
  } catch (error) {
    handleServerError(res, error.message);
  }
};

// exports.addAgen = async (req, res) => {
//   try {
//     const model = new Model_cud(req);
//     const data = await model.tambahAgen();
//     res.status(200).json(data);
//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

// // delete process
// exports.delete = async (req, res) => {

//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model = new Model_cud(req);
//     await model.delete();

//     // get response
//     if (await model.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Agen berhasil dihapus.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Agen gagal dihapus.',
//       });
//     }

//   } catch (error) {

//     console.log("---------------");
//     console.log(error);
//     console.log("---------------");
//     handleServerError(res, error.message);
//   }
// };
