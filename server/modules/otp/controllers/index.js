const axios = require("axios");
const { Otp, sequelize, AmraSettings } = require("../models/model_cud");
const { Op } = require("sequelize");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  const { whatsappNumber } = req.body;

  // ✅ Validasi nomor WhatsApp (harus mulai dengan 08 dan panjang 10-12 digit)
  if (!/^(08)\d{8,10}$/.test(whatsappNumber)) {
    return res.status(400).json({
      error:
        "Nomor WhatsApp harus berformat Indonesia (08) dan memiliki 10-12 digit.",
      code: "INVALID_PHONE_NUMBER",
    });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiredTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 hari
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  try {
    console.log("🛠 Mengecek limit OTP...");

    // ✅ Cek apakah user sudah request OTP lebih dari 2x hari ini
    const otpCount = await Otp.count({
      where: {
        mobile_number: whatsappNumber,
        createdAt: { [Op.gte]: startOfDay },
      },
    });

    if (otpCount >= 2) {
      return res.status(429).json({
        error: "Batas maksimal OTP tercapai. Coba lagi besok.",
        code: "OTP_LIMIT_REACHED",
      });
    }

    console.log("🛠 Mengecek konfigurasi API dari database...");
    const settings = await AmraSettings.findAll({
      where: { name: ["wapisender_api_key", "wapisender_device_key"] },
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    }, {});

    const wapisender_api_key = settingsMap["wapisender_api_key"];
    const wapisender_device_key = settingsMap["wapisender_device_key"];

    if (!wapisender_api_key || !wapisender_device_key) {
      return res.status(500).json({
        error: "API Key atau Device Key tidak ditemukan",
        code: "API_KEY_MISSING",
      });
    }

    // ✅ Update semua OTP lama jadi inactive, biarkan yang sudah digunakan tetap aktif
    console.log("🔄 Menonaktifkan OTP lama yang belum digunakan...");
    await Otp.update(
      { otp_status: "inactive" },
      {
        where: {
          mobile_number: whatsappNumber,
          otp_status: "active",
          expired_time: { [Op.gt]: new Date() }, // Masih berlaku
        },
      }
    );

    console.log("📨 Mengirim OTP ke:", whatsappNumber);
    const message = `Kode OTP Anda adalah ${otpCode}`;
    const wapisenderResponse = await axios.post(
      "https://wapisender.id/api/v5/message/text",
      {
        api_key: wapisender_api_key,
        device_key: wapisender_device_key,
        destination: whatsappNumber,
        message: message,
      }
    );

    console.log("✅ Wapisender Response:", wapisenderResponse.data);

    if (wapisenderResponse.data.status !== "ok") {
      console.error("❌ Gagal mengirim OTP:", wapisenderResponse.data);
      return res.status(500).json({
        error: "Gagal mengirim OTP",
        code: "OTP_SEND_FAILED",
        detail: wapisenderResponse.data,
      });
    }

    console.log("🔄 Menyimpan OTP baru ke database...");
    const savedOtp = await Otp.create({
      otp_code: otpCode,
      expired_time: expiredTime,
      mobile_number: whatsappNumber,
      otp_type: "registration",
      otp_status: "active",
      user_type: "amra",
    });

    console.log("✅ OTP berhasil disimpan:", savedOtp.toJSON());

    return res.json({ status: "OTP berhasil dikirim", otp: otpCode });
  } catch (error) {
    console.error("❌ Error saat mengirim/simpan OTP:", error);

    return res.status(500).json({
      error: "Terjadi kesalahan saat mengirim/simpan OTP",
      code: "INTERNAL_SERVER_ERROR",
      detail: error.message || error,
    });
  }
};
