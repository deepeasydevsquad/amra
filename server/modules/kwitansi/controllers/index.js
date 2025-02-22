const axios = require("axios");
const {
  sequelize,
  Subscribtion_Payment_History,
  Company,
  AmraSetting,
} = require("../models/model_r");

const getKwitansi = async (req, res) => {
  const { order_id } = req.params;

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    const hargaLanggananSetting = await AmraSetting.findOne({
      where: { name: "harga_langganan" },
    });

    const namaRekeningSetting = await AmraSetting.findOne({
      where: { name: "nama_rekening" },
    });

    if (!hargaLanggananSetting || !namaRekeningSetting) {
      return res.status(404).json({ message: "Pengaturan tidak ditemukan" });
    }

    const hargaLangganan = hargaLanggananSetting.value;
    const namaRekening = namaRekeningSetting.value;

    // Ambil data pembayaran dari database
    const payment = await Subscribtion_Payment_History.findOne({
      where: { order_id },
      attributes: ["order_id", "status", "createdAt"],
    });

    if (!payment) {
      return res.status(404).json({ message: "Kwitansi tidak ditemukan" });
    }

    // 🔥 Ambil data transaksi dari Midtrans
    const midtransResponse = await axios.get(
      `${process.env.MIDTRANS_GET_STATUS_URL}/${order_id}/status`, // ✅ Tambahkan /status
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.MIDTRANS_SERVER_KEY + ":"
          ).toString("base64")}`,
        },
      }
    );

    const midtransData = midtransResponse.data;
    const va_numbers = midtransData.va_numbers || [];
    const bank = va_numbers.length > 0 ? va_numbers[0].bank : "Tidak tersedia";
    const va_number =
      va_numbers.length > 0 ? va_numbers[0].va_number : "Tidak tersedia";

    // Response JSON
    res.status(200).json({
      order_id: payment.order_id,
      bank,
      va_number,
      status: payment.status,
      harga: hargaLangganan,
      nama_rekening: namaRekening,
      created_at: payment.createdAt,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching receipt:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { getKwitansi };
