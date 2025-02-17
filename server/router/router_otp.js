const express = require("express");
const router = express.Router();
const Controller = require("../modules/otp/controllers/index"); // Pastikan ini benar

console.log("Controller loaded:", Controller); // Debugging

router.post("/send-otp", Controller.sendOtp); // Pastikan tidak typo

module.exports = router;
