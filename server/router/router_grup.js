const express = require("express");
const controller = require("../modules/grup/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/get-menu", authenticateToken, controller.getMenu);
router.get("/get-grup", authenticateToken, controller.getGrup);
router.post("/add-grup", authenticateToken, controller.addGrup);
router.put("/update-grup/", authenticateToken, controller.updateGrup);
router.post("/delete-grup/", authenticateToken, controller.deleteGrup);

module.exports = router;
