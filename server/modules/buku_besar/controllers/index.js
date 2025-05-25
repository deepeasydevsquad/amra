const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");
const ExcelJS = require("exceljs");

const controllers = {};

// **Mendapatkan daftar investor**
controllers.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.list(); // Ambil daftar investor dari model
    res.status(200).json({ error: false, data : feedBack });
  } catch (error) {

    console.log("------");
    console.log(error);
    console.log("------");
    handleServerError(res, error.message);
  }
};

controllers.downloadDataPeminjaman = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.list(); // Ambil daftar investor dari model
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Buku Besar");

    worksheet.columns = [
      { header: "TANGGAL", key: "tanggal", width: 25 },
      { header: "REF", key: "ref", width: 50 },
      { header: "KETERANGAN", key: "keterangan", width: 50 },
      { header: "DEBET", key: "debet", width: 20 },
      { header: "KREDIT", key: "kredit", width: 20 },
      { header: "SALDO", key: "saldo", width: 20 },
    ];

    let no = 1;

    const headerRow = worksheet.getRow(no);
    headerRow.height = 25; // ✅ Set tinggi baris
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' }, // Biru donker
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.border = {
        top:    { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left:   { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right:  { style: 'thin', color: { argb: 'FFFFFFFF' } },
      };
    });

    for (const data of feedBack.list) {
      no++;

      worksheet.addRow({
        tanggal : data.tanggal, 
        ref : data.ref, 
        keterangan: data.ket, 
        debet: data.debet,
        kredit: data.kredit,
        saldo: data.saldo
      });

      var headerColumn = worksheet.getRow(no);
      headerColumn.height = 25; 
      headerColumn.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top:    { style: 'thin', color: { argb: 'FF1E3A8A' } },
          left:   { style: 'thin', color: { argb: 'FF1E3A8A' } },
          bottom: { style: 'thin', color: { argb: 'FF1E3A8A' } },
          right:  { style: 'thin', color: { argb: 'FF1E3A8A' } },
        };
      });
    }

    let buffer;
    try {
      buffer = await workbook.xlsx.writeBuffer();
    } catch (err) {
      console.error("Gagal generate file Excel:", err);
      return res.status(500).json({ message: "Gagal generate file Excel." });
    }
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Data_Buku_Besar.xlsx"
    );
    res.send(buffer);
      
    //res.status(200).json({ error: false, data : feedBack });
  } catch (error) {

    console.log("------");
    console.log(error);
    console.log("------");
    handleServerError(res, error.message);
  }
}

// // **Menambahkan investor baru**
// controllers.add = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.add();
//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Investor Baru berhasil ditambahkan.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Investor Baru Gagal Ditambahkan.',
//       });
//     }
//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

// // **Update airline**
// controllers.update = async (req, res) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.update();
//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Investor berhasil Diupdate.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Investor Gagal Diupdate.',
//       });
//     }

//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// };

// controllers.infoAdd = async ( req, res ) => {
//    try {
//       const model_r = new Model_r(req);
//       const feedBack = await model_r.getCabang(); // Ambil daftar airline dari model
//       res.status(200).json({ error: false, data : feedBack });
//    } catch (error) {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Info tidak ditemukan.',
//       });
//    }
// }

// controllers.infoEdit = async ( req, res ) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//       const model_r = new Model_r(req);
//       const infoInvestor = await model_r.getInvestor();
//       res.status(200).json({ error: false, data : infoInvestor });
//   } catch (error) {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Info tidak ditemukan.',
//       });
//   }
// }

// controllers.delete = async ( req, res ) => {
//   if (!(await handleValidationErrors(req, res))) return;

//   try {
//     const model_cud = new Model_cud(req);
//     await model_cud.delete();
//     // get response
//     if (await model_cud.response()) {
//       res.status(200).json({
//         error: false,
//         error_msg: 'Investor berhasil dihapus.',
//       });
//     } else {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Investor gagal dihapus.',
//       });
//     }

//   } catch (error) {
//     handleServerError(res, error.message);
//   }
// }

module.exports = controllers;
