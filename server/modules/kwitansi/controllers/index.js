"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Model_r = require("../models/model_r");
const { handleServerError } = require("../../../helper/handleError");

exports.getKwitansi = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const price = await model_r.getPrice();
    const rekening = await model_r.getRekening();
    const order_id = await model_r.getOrderid();
    const midtrans = await model_r.getMidtrans();

    console.log("🔍 Full Midtrans Response:", rekening); // DEBUG OUTPUT

    return res.status(200).json({
      order_id: order_id.order_id,
      price: price,
      rekening: rekening, // ✅ Fix: gunakan rekening.value
      bank: midtrans.bank, // ✅ Fix: ambil dari midtrans response
      va_number: midtrans.va_number, // ✅ Fix: ambil dari midtrans response
      status: order_id.status,
      createdAt: order_id.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching receipt:", error);
    handleServerError(res);
    return res
      .status(500)
      .json({ error: true, error_msg: "Terjadi kesalahan server" });
  }
};
