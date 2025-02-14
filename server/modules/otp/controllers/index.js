const axios = require("axios");
const { Otp, sequelize, AmraSettings } = require("../models/model_cud"); // Pastikan path benar
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  const { whatsappNumber } = req.body;

  if (!whatsappNumber || !/^\d+$/.test(whatsappNumber)) {
    return res.status(400).json({ error: "Nomor WhatsApp tidak valid" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiredTime = new Date(Date.now() + 1 * 60 * 1000);
  const message = `Kode OTP Anda adalah ${otpCode}`;

  try {
    console.log("🛠 Mengambil konfigurasi API dari database...");

    // Ambil data API Key & Device Key dari tabel key-value
    const settings = await AmraSettings.findAll({
      where: { name: ["wapisender_api_key", "wapisender_device_key"] },
    });

    // Konversi ke object supaya lebih mudah dipakai
    const settingsMap = {};
    settings.forEach((setting) => {
      settingsMap[setting.name] = setting.value;
    });

    const wapisender_api_key = settingsMap["wapisender_api_key"];
    const wapisender_device_key = settingsMap["wapisender_device_key"];

    if (!wapisender_api_key || !wapisender_device_key) {
      return res
        .status(500)
        .json({ error: "API Key atau Device Key tidak ditemukan" });
    }

    console.log("🛠 Cek koneksi database...");
    await sequelize.authenticate();
    console.log("✅ Database terhubung!");

    console.log("📨 Mengirim OTP ke:", whatsappNumber);

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
        detail: wapisenderResponse.data,
      });
    }

    const otpData = {
      otp_code: otpCode,
      expired_time: expiredTime,
      mobile_number: whatsappNumber,
      otp_type: "registration",
      otp_status: "active",
      user_type: "amra",
    };

    console.log("🔄 Menyimpan OTP ke database...");

    const savedOtp = await Otp.create(otpData);

    console.log("✅ OTP berhasil disimpan ke database:", savedOtp.toJSON());

    return res.json({ status: "OTP berhasil dikirim", otp: otpCode });
  } catch (error) {
    console.error("❌ Error saat mengirim/simpan OTP:", error);
    return res.status(500).json({ error: "Gagal mengirim/simpan OTP" });
  }
};
