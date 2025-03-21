const express = require("express");
const controllers = require("../modules/member/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");
const { validateMember, upload } = require("../validation/member"); // Pastikan ini adalah class
const router = express.Router();

router.post(
  "/add-member",
  authenticateToken,
  // validateMember,
  upload.single("photo"),
  controllers.create
);

router.get("/get-type", authenticateToken, controllers.getType);

router.get("/get-member", authenticateToken, controllers.get);

router.put(
  "/update-member",
  authenticateToken,
  // validateMember,
  upload.single("photo"),
  controllers.update
);

router.post("/delete-member", authenticateToken, controllers.delete);

module.exports = router;
