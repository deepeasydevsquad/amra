const {
  Peminjaman,
  Skema_peminjaman,
  Riwayat_pembayaran_peminjaman,
  Deposit,
  Fee_agen,
  Member,
  Company,
  Level_keagenan,
  Jamaah,
  Agen,
} = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");
const { sequelize } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.tipe = req;
    this.company_id;
    this.message = "";
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async saldo() {
    try {
      const jamaah = await Jamaah.findOne({
        where: { id: this.req.body.jamaah_id },
      });

      if (!jamaah || !jamaah.member_id) {
        console.warn("Member ID dari Jamaah tidak ditemukan.");
        return 0;
      }

      const member = await Member.findOne({
        attributes: ["total_deposit"],
        where: {
          id: jamaah.member_id,
        },
      });

      return member?.total_deposit ?? 0;
    } catch (error) {
      console.error("Gagal ambil saldo:", error);
      return 0;
    }
  }

  async utang() {
    const biaya_pinjam = Number(this.req.body.biaya_pinjam);
    const dp = Number(this.req.body.dp);
    try {
      return biaya_pinjam - dp;
    } catch (error) {
      console.log("Gagal mendapatkan utang dari body");
      return null;
    }
  }

  async pembayaran_perbulan() {
    const utang = await this.utang();
    const tenor = Number(this.req.body.tenor);
    const mulaiTanggal = moment(this.req.body.mulai_tanggal);
    try {
      if (!utang || !tenor) throw new Error("Utang atau tenor tidak valid");

      const bayarPerBulan = Math.ceil(utang / tenor);
      const listPembayaran = [];

      for (let i = 0; i < tenor; i++) {
        const jatuhTempo = new Date(mulaiTanggal);
        jatuhTempo.setMonth(jatuhTempo.getMonth() + i);

        let jumlah = bayarPerBulan;
        if (i === tenor - 1) {
          jumlah = utang - bayarPerBulan * (tenor - 1);
        }

        listPembayaran.push({
          bulan_ke: i + 1,
          jumlah,
          jatuh_tempo: jatuhTempo.toISOString().split("T")[0],
        });
      }

      return listPembayaran;
    } catch (error) {
      console.log("Gagal mendapatkan pembayaran perbulan:", error.message);
      return [];
    }
  }

  async petugas() {
    this.tipe = await tipe(this.req);

    if (this.tipe === "administrator") {
      const company = await Company.findOne({
        where: { id: this.company_id },
      });
      return company?.company_name ?? "Unknown Company";
    }

    if (this.tipe === "staff") {
      const member = await Member.findOne({
        where: { company_id: this.company_id, role: "staff" },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }

  async register_number() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const getRandomLetter = () =>
      letters[Math.floor(Math.random() * letters.length)];
    const getRandomNumber = () => Math.floor(Math.random() * 10);
    return (
      getRandomLetter() +
      getRandomLetter() +
      Array.from({ length: 8 }, getRandomNumber).join("")
    );
  }

  async generateInvoice() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let huruf = "",
      angka = "";
    for (let i = 0; i < 3; i++) {
      huruf += letters.charAt(Math.floor(Math.random() * letters.length));
      angka += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return huruf + angka;
  }

  async penerima() {
    return await this.petugas(); // kalau ternyata sama
  }

  async defaultFee() {
    try {
      const jamaah = await Jamaah.findOne({
        where: { id: this.req.body.jamaah_id },
        include: {
          model: Agen,
          include: {
            model: Level_keagenan,
          },
        },
      });

      const default_fee = jamaah?.Agen?.Level_keagenan?.default_fee ?? 0;
      const agen_id = jamaah?.Agen?.id ?? null;

      return { default_fee, agen_id };
    } catch (error) {
      console.error("Gagal ambil default_fee dan agen_id:", error);
      return { default_fee: 0, agen_id: null };
    }
  }

  async Fee_agen() {
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const { default_fee, agen_id } = await this.defaultFee();

    try {
      const fee_agen = await Fee_agen.create(
        {
          company_id: this.company_id,
          agen_id: agen_id,
          invoice: await this.generateInvoice(),
          nominal: default_fee,
          status_bayar: "belum_lunas",
          info: "dari pinjaman jamaah",
          pembayaran_fee_agen_id: agen_id,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t, // ⬅️ tambahin ini biar ikut transaksi
        }
      );

      return fee_agen;
    } catch (error) {
      console.error("Gagal membuat Fee_agen:", error);
      this.state = false;
      this.message = "Gagal membuat Fee_agen: " + error.message;
      return null;
    }
  }

  async Skema_peminjaman() {
    const { tanggal_mulai, nominal, tenor, dp, jamaah_id } = this.req.body;
    console.log(this.req.body);
    const company_id = this.company_id;

    console.log("===================================");
    console.log("peminjam_id:", jamaah_id);
    console.log("===================================");

    const utang = nominal - dp;

    // Pembulatan ke kelipatan ribuan
    let biaya_perbulan = Math.ceil(utang / tenor / 1000) * 1000; // Pembulatan ke ribuan

    // Hitung sisa utang setelah pembagian per bulan
    const sisaUtang = utang - biaya_perbulan * (tenor - 1); // Pembayaran terakhir untuk menyesuaikan sisa
    biaya_perbulan = biaya_perbulan > 0 ? biaya_perbulan : 1000; // Pastikan biaya per bulan minimal 1000

    const peminjaman = await Peminjaman.findOne({
      attributes: ["id"],
      where: { jamaah_id: jamaah_id },
      transaction: this.t, // optional, biar lebih safety
    });

    const peminjaman_id = peminjaman?.id;
    if (!peminjaman_id) throw new Error("Peminjaman tidak ditemukan");

    const skema = [];

    for (let i = 0; i < tenor; i++) {
      let jumlah_pembayaran = biaya_perbulan;
      if (i === tenor - 1) {
        jumlah_pembayaran = sisaUtang; // Pastikan pembayaran terakhir sesuai sisa utang
      }

      skema.push({
        company_id,
        peminjaman_id,
        term: i + 1,
        nominal: jumlah_pembayaran,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Skema_peminjaman.bulkCreate(skema, { transaction: this.t }); // 🔥 tambah transaction
  }

  async createPeminjaman() {
    await this.initialize();
    const t = this.t;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const petugas = await this.petugas();
    const register_number = await this.register_number();
    const generateInvoice = await this.generateInvoice();
    const peminjam_id = body.jamaah_id;
    const dp = Number(body.dp);
    const nominal = Number(body.nominal);
    const sudahBerangkat = body.sudah_berangkat || false;

    try {
      console.log("===================================");
      console.log("Step 1: Peminjaman");
      console.log("peminjam_id:", peminjam_id);
      console.log("===================================");
      await Peminjaman.create(
        {
          company_id: this.company_id,
          jamaah_id: peminjam_id,
          register_number,
          nominal,
          status_peminjaman: 'belum_lunas',
          tenor: body.tenor,
          dp,
          petugas,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: t }
      );

      console.log("===================================");
      console.log("Step 2: Skema Peminjaman");
      console.log("===================================");

      await this.Skema_peminjaman();

      console.log("===================================");
      console.log("Step 3: Riwayat Pembayaran Peminjaman");
      console.log("===================================");

      const peminjaman = await Peminjaman.findOne({
        attributes: ["id"],
        where: { jamaah_id: peminjam_id },
        transaction: this.t, // ← optional, biar lebih safety
      });

      const peminjaman_id = peminjaman?.id;
      if (!peminjaman_id) throw new Error("Peminjaman tidak ditemukan");
      if (dp > 0) {
        await Riwayat_pembayaran_peminjaman.create(
          {
            company_id: this.company_id,
            peminjaman_id: peminjaman_id,
            invoice: generateInvoice,
            nominal,
            status: "dp",
            petugas,
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: t }
        );
      }
      console.log("===================================");
      console.log(" Step 4: Saldo Sebelum dan Sesudah");
      console.log("===================================");
      const saldoSebelum = await this.saldo();
      const saldoSesudah = saldoSebelum + nominal;

      const jamaahData = await Jamaah.findOne({
        where: { id: peminjam_id },
      });

      const member_id = jamaahData?.member_id;

      console.log("===================================");
      console.log("Step 5: Deposit jika belum berangkat");
      console.log("===================================");
      if (!sudahBerangkat && member_id) {
        await Deposit.create(
          {
            company_id: this.company_id,
            member_id,
            invoice: generateInvoice,
            nominal,
            saldo_sebelum: saldoSebelum,
            saldo_sesudah: saldoSesudah,
            sumber_dana: "cash",
            penerima: await this.penerima(),
            tipe_transaksi: "deposit",
            info: "dari peminjaman yang belum berangkat",
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: t }
        );
      }
      console.log("===================================");
      console.log("Step 6: Fee Agen jika ada agen_id");
      console.log("===================================");
      const jamaah = await Jamaah.findOne({
        where: { id: peminjam_id },
        attributes: ["agen_id"],
      });

      if (jamaah?.agen_id) {
        await this.Fee_agen();
      }

      this.message = "Peminjaman berhasil dibuat";
    } catch (error) {
      this.message = "Gagal membuat peminjaman: " + error.message;
      this.state = false;
      console.error(error);
    }
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
