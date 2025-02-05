const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/example/controller/index");
const validation = require("../validation/example");

//------MIDDLEWARE-----//
const { verify_session, verify_token } = require("../../../middleware/verify_session_token");

// ROUTER
const router = express.Router();

router.get("/Example", controllers.Administrator);

router.post("/Example/server_side",
  [verify_token],
  body("perpage").notEmpty().withMessage("Nomor Page Tidak Boleh Kosong").isNumeric().withMessage("Halaman harus dalam angka").trim().custom(validation.check_id), 
  body("search").trim(), 
  controllers.server_side
);




module.exports = router;