const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/pengguna/controllers/index");
const router = express.Router();

console.log("Controllers Object:", controllers);
console.log("editPengguna Function:", controllers.editPengguna);


router.get("/get-pengguna", authenticateToken, controllers.getPengguna);
router.post("/add-pengguna", authenticateToken, controllers.addPengguna);
router.put("/edit-pengguna", authenticateToken, controllers.editPengguna);
router.post("/delete-pengguna", authenticateToken, controllers.deletePengguna)

module.exports = router;
