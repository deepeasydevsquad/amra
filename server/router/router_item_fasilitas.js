const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../modules/item_fasilitas/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
// const validation = require("../validation/invoice");

const router = express.Router();

router.post(
  "/item_fasilitas/list",
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
    body("status").trim(),
  ],
  controller.list
);

router.post(
  "/item_fasilitas/delete",
  authenticateToken,
  [body("id").trim().notEmpty().withMessage("ID tidak boleh kosong.")],
  controller.hapus_stok
);

module.exports = router;
