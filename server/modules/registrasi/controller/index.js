"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const {
  Company,
  Otp,
  SubscriptionPaymentHistory,
  AmraSettings,
} = require("../models/model_cud");
require("dotenv").config();

exports.getSubscriptionPrice = async (req, res) => {
  try {
    const settings = await AmraSettings.findOne({
      where: { name: "harga_langganan" },
    });

    if (!settings) {
      return res.status(404).json({ error: "Harga langganan tidak ditemukan" });
    }

    return res.status(200).json({ harga_langganan: settings.value });
  } catch (error) {
    console.error("❌ Error mengambil harga langganan:", error);
    return res.status(500).json({ error: "Gagal mengambil harga langganan" });
  }
};

exports.registerCompany = async (req, res) => {
  const {
    company_name,
    email,
    whatsapp_company_number,
    username,
    password,
    token,
  } = req.body;

  if (
    !company_name ||
    !email ||
    !whatsapp_company_number ||
    !username ||
    !password ||
    !token
  ) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  try {
    // ✅ Cek OTP
    const otpRecord = await Otp.findOne({
      where: {
        mobile_number: whatsapp_company_number,
        otp_code: token,
        otp_status: "active",
      },
    });
    if (!otpRecord || new Date(otpRecord.expired_time) < new Date()) {
      return res
        .status(400)
        .json({ error: "OTP tidak valid atau sudah kadaluarsa" });
    }

    // ✅ Cek apakah nomor sudah terdaftar
    const existingCompany = await Company.findOne({
      where: { whatsapp_company_number },
    });
    if (existingCompany) {
      return res.status(400).json({ error: "Nomor sudah terdaftar di sistem" });
    }

    // ✅ Ambil harga paket premium dari `amra_settings`
    const settings = await AmraSettings.findOne({
      where: { name: "harga_langganan" },
    });
    const packagePrice = settings ? parseInt(settings.value, 10) : 0;
    if (packagePrice <= 0) {
      return res.status(500).json({ error: "Harga langganan tidak valid" });
    }

    // ✅ Generate kode perusahaan unik
    let companyCode;
    do {
      companyCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (await Company.findOne({ where: { code: companyCode } }));

    // ✅ Generate token unik 49 karakter
    let refreshToken;
    do {
      refreshToken = uuidv4().replace(/-/g, "").substring(0, 49);
    } while (await Company.findOne({ where: { refresh_token: refreshToken } }));

    // ✅ Enkode password menggunakan JWT
    const hashedPassword = jwt.sign({ password }, process.env.SECRET_KEY);

    // ✅ Hitung tanggal akhir berlangganan
    const endSubscription = moment()
      .add(1, "years")
      .format("YYYY-MM-DD HH:mm:ss");

    // ✅ Request order ID ke Midtrans
    const order_id = `ORDER-${uuidv4()}`;
    let midtransResponse;
    try {
      midtransResponse = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        {
          transaction_details: { order_id, gross_amount: packagePrice },
          customer_details: { email, phone: whatsapp_company_number },
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
    } catch (err) {
      console.error("❌ Error Midtrans:", err.response?.data || err.message);
      return res
        .status(500)
        .json({ error: "Gagal mendapatkan order ID dari Midtrans" });
    }

    const midtransToken = midtransResponse.data?.token || null;
    const midtransRedirectUrl = midtransResponse.data?.redirect_url || null;

    // ✅ Simpan data ke database
    const newCompany = await Company.create({
      code: companyCode,
      kurs: "rp",
      logo: "",
      icon: "",
      company_name,
      email,
      type: "limited",
      verify_status: "unverified",
      verify_time: null,
      whatsapp_company_number,
      otp: otpRecord.otp_code,
      otp_expired_time: otpRecord.expired_time,
      invoice_logo: null,
      invoice_title: null,
      start_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_subscribtion: endSubscription,
      whatsapp_device_number: null,
      whatsapp_device_key: null,
      refresh_token: refreshToken,
      saldo: 0,
      markup_ppob: 0,
      username,
      password: hashedPassword,
      start_date_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_date_subscribtion: endSubscription,
      transaction_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    await SubscriptionPaymentHistory.create({
      company_id: newCompany.id,
      order_id,
      amount: packagePrice,
      status: "pending",
    });

    return res.status(201).json({
      message: "Registrasi berhasil!",
      order_id,
      midtrans_token: midtransToken,
      midtrans_redirect_url: midtransRedirectUrl,
    });
  } catch (error) {
    console.error("❌ Error registrasi perusahaan:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan dalam registrasi" });
  }
};
