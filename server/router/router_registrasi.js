const express = require("express");
const router = express.Router();
const Controller = require("../modules/registrasi/controller/index");
const {
  getSubscriptionPrice,
} = require("../modules/registrasi/controller/index");
console.log("Controller loaded:", Controller);
router.post("/register", Controller.registerCompany);
router.get("/ambil_harga", Controller.getSubscriptionPrice);
module.exports = router;
