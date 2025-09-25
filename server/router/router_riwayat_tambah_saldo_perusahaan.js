const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/request_tambah_saldo_perusahaan/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/request_tambah_saldo_perusahaan");

const router = express.Router();

router.post(
  "/riwayat_tambah_saldo_perusahaan/list",
  authenticateToken,
  [
    body("pageNumber")
      .trim()
      .notEmpty()
      .withMessage("Page Number tidak boleh kosong."),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.list
);

// router.post(
//   "/request_member/setujuiRequestMember",
//   authenticateToken,
//   [
//     body("id").trim().notEmpty().withMessage("Id tidak boleh kosong.").isNumeric().withMessage("ID Request harus berupa angka.").custom(validation.check_id_request_member),
//   ],
//   controllers.setujuiRequestMember
// );

// router.post(
//   "/request_member/rejectRequestMember",
//   authenticateToken,
//   [
//     body("id").trim().notEmpty().withMessage("Id tidak boleh kosong.").isNumeric().withMessage("ID Request harus berupa angka.").custom(validation.check_id_request_member),
//   ],
//   controllers.rejectRequestMember
// );

// export const setujuiRequestMember = async (id : number) => {
//   try {
//     const response = await api.post("/request_member/setujuiRequestMember", { id : id });
//     return response.data;
//   } catch (error) {
//     console.error("Gagal:", error);
//     throw error;
//   }
// };

// export const rejectRequestMember = async (id : number) => {
//   try {
//     const response = await api.post("/request_member/rejectRequestMember", { id : id });
//     return response.data;
//   } catch (error) {
//     console.error("Gagal:", error);
//     throw error;
//   }
// };

// router.post(
//   "/airlines/add",
//   authenticateToken,
//   [
//     body("name").trim().notEmpty().withMessage("Nama Maskapai tidak boleh kosong.").toUpperCase(),
//   ],
//   controllers.add
// );

// router.post(
//   "/airlines/update",
//   authenticateToken,
//   [
//     body("id").trim().notEmpty().withMessage("ID Maskapai tidak boleh kosong.").custom(validation.check_id_airlines),
//     body("name").trim().notEmpty().withMessage("Nama Maskapai tidak boleh kosong.").toUpperCase(),
//   ],
//   controllers.update
// );

// router.post(
//   "/airlines/delete",
//   authenticateToken,
//   [
//     body("id").trim().notEmpty().withMessage("ID Maskapai tidak boleh kosong.").isInt().withMessage("ID Maskapai harus berupa angka.").custom(validation.check_id_airlines).custom(validation.check_delete_is_allow)
//   ],
//   controllers.delete
// );

module.exports = router;
