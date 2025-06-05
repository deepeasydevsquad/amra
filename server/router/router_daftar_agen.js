const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/daftar_agen/controllers/index");
const router = express.Router();

router.post("/agen/getAgen", authenticateToken, 
    [
        body("cabang").trim().notEmpty().withMessage("Cabang tidak boleh kosong."),
        body("pageNumber").trim().notEmpty().withMessage("Page Number tidak boleh kosong."),
        body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
        body("search").trim(),
    ],
    controllers.getAgen
);

router.post("/addAgen", authenticateToken, controllers.addAgen);
router.post("/deleteAgen", authenticateToken, controllers.deleteAgen);

module.exports = router;
