"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");

const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.getSubscriptionPrice = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const e = await model_r.getAmraSetting();

    if (Object.keys(e).length == 0) {
      return res
        .status(404)
        .json({ error: true, error_msg: "Harga langganan tidak ditemukan" });
    }

    return res.status(200).json(e.data);
  } catch (error) {
    console.error("❌ Error mengambil harga langganan:", error);
    return res
      .status(500)
      .json({ error: true, error_msg: "Gagal mengambil harga langganan" });
  }
};

exports.registerCompany = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const body = req.body;
    const model_r = new Model_r(req);
    const company_code = await model_r.generated_company_code();
    const refresh_token = await model_r.generated_company_refresh_token();
    const price = await model_r.get_price();
    const hashedPassword = jwt.sign(
      { password: body.password },
      process.env.SECRET_KEY
    );
    const endSubscription = moment()
      .add(1, "years")
      .format("YYYY-MM-DD HH:mm:ss");
    const otp = await model_r.get_otp({
      whatsapp_company_number: body.whatsapp_company_number,
      token: body.token,
    });
    const order_id = `ORDER-${uuidv4()}`;

    let midtransResponse;
    try {
      midtransResponse = await axios.post(
        process.env.NODE_ENV === "development"
          ? process.env.MIDTRANS_SANDBOX_URL
          : process.env.MIDTRANS_PRODUCTION_URL,
        {
          transaction_details: { order_id, gross_amount: price },
          customer_details: {
            email: body.email,
            phone: body.whatsapp_company_number,
          },
          payment_type: "bank_transfer",
          bank_transfer: {
            bank: "bri",
          },
          callbacks: {
            finish: `http://localhost:5173/kwitansi?order_id=${order_id}`,
          },
        },

        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.MIDTRANS_SERVER_KEY + ":"
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const midtransVaNumbers = midtransResponse.data?.va_numbers || [];
      const midtransRedirectUrl = midtransResponse.data?.redirect_url || null;

      console.log("FeedBack-----Midtrans----");
      console.log(midtransVaNumbers);
      console.log(midtransRedirectUrl);
      console.log("FeedBack-----Midtrans----");

      const model_cud = new Model_cud(req);
      await model_cud.create_company({
        email: body.email,
        company_code,
        company_name: body.company_name,
        whatsapp_company_number: body.whatsapp_company_number,
        otp_code: otp.otp_code,
        expired_time: otp.expired_time,
        end_subscription: endSubscription,
        refresh_token,
        username: body.username,
        hash_password: hashedPassword,
        order_id,
        price,
      });

      if (await model_cud.response()) {
        return res.status(201).json({
          message: "Registrasi berhasil!",
          order_id,
          midtrans_va_numbers: midtransVaNumbers,
          midtrans_redirect_url: midtransRedirectUrl,
        });
      } else {
        res.status(400).json({
          error: true,
          error_msg: "Proses simpan data Perusahaan baru gagal dilakukan.",
        });
      }
    } catch (err) {
      console.error("❌ Error Midtrans:", err.response?.data || err.message);
      return res.status(500).json({
        error: true,
        error_msg: "Gagal mendapatkan order ID dari Midtrans",
      });
    }
  } catch (error) {
    console.log("------Error1");
    console.log(error);
    console.log("------Error1");
    handleServerError(res);
  }
};
