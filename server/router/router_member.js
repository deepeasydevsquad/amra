const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/member/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const { validateMember, upload, check_member_id } = require("../validation/member"); // Pastikan ini adalah class
const router = express.Router();

router.post("/member/daftarMember", 
  authenticateToken, 
  [
    body("pageNumber").trim().notEmpty().withMessage("Page Number tidak boleh kosong."),
    body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controllers.list
);

router.post("/member/infoEditMember",
  authenticateToken,
  [
    body("id").trim().notEmpty().withMessage("ID Member tidak boleh kosong.").custom( check_member_id ),
  ],
  controllers.infoEditMember
);

router.post("/member/delete-member", 
  authenticateToken, 
  [
    body("id").trim().notEmpty().withMessage("ID Member tidak boleh kosong.").custom( check_member_id ),
  ], 
  controllers.delete
);

router.post(
  "/add-member",
  authenticateToken,
  upload.single("photo"),
  controllers.create
);

router.get("/get-type", authenticateToken, controllers.getType);

router.put(
  "/update-member",
  authenticateToken,
  // validateMember,
  upload.single("photo"),
  controllers.update
);

router.get("/member/get-daftar-cabang", authenticateToken, controllers.getDaftarCabang);

module.exports = router;
