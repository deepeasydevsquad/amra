const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/daftar_jamaah/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const { upload } = require("../validation/member");
const {
  tambahJamaahValidator,
  updateJamaahValidator,
} = require("../validation/daftar_jamaah");

const router = express.Router();

router.post(
  "/get-daftar-jamaah",
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getJamaah
);

router.post(
  "/add-daftar-jamaah",
  upload.single("photo"), // ⬅️ HARUS duluan
  // tambahJamaahValidator,
  authenticateToken,
  controller.addJamaah
);

router.post(
  "/edit-daftar-jamaah",
  upload.single("photo"),
  updateJamaahValidator,
  authenticateToken,
  controller.editJamaah
);

router.post(
  "/delete-daftar-jamaah",
  authenticateToken,
  controller.deleteJamaah
);

module.exports = router;
