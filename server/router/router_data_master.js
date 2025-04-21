const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/data_master/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/get-provinsi",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getProvinsi
);
router.post(
  "/get-kabupaten",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getKabupaten
);
router.post(
  "/get-kecamatan",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getKecamatan
);
router.post(
  "/get-kelurahan",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getKelurahan
);
router.post(
  "/get-mahram",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getMahram
);
router.post(
  "/get-pekerjaan",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getPekerjaan
);
router.post(
  "/get-pendidikan",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getPendiidikan
);
router.post(
  "/get-pengalaman",
  authenticateToken,
  [body("pageNumber").trim(), body("perpage").trim(), body("search").trim()],
  authenticateToken,
  controller.getPengalamanHajiUmrah
);

module.exports = router;
