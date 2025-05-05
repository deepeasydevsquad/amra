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
    this.company_id = null;
    this.message = "";
    this.t = null;
    this.state = true;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
  }

  async saldo() {
    try {
      const jamaah = await Jamaah.findOne({
        where: { id: this.req.body.jamaah_id },
      });
      if (!jamaah || !jamaah.member_id) return 0;

      const member = await Member.findOne({
        attributes: ["total_deposit"],
        where: { id: jamaah.member_id },
      });

      return member?.total_deposit ?? 0;
    } catch (err) {
      console.error("Gagal ambil saldo:", err);
      return 0;
    }
  }

  async petugas() {
    const role = await tipe(this.req);

    if (role === "administrator") {
      const company = await Company.findOne({ where: { id: this.company_id } });
      return company?.company_name ?? "Unknown Company";
    }

    if (role === "staff") {
      const member = await Member.findOne({
        where: { company_id: this.company_id, role: "staff" },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }

  async register_number() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = () => Math.floor(Math.random() * 10);
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
    return `${randomChar()}${randomChar()}${Array.from(
      { length: 8 },
      digits
    ).join("")}`;
  }

  async generateInvoice() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let huruf = "",
      angka = "";
    for (let i = 0; i < 3; i++) {
      huruf += chars[Math.floor(Math.random() * chars.length)];
      angka += nums[Math.floor(Math.random() * nums.length)];
    }
    return huruf + angka;
  }

  async defaultFee() {
    try {
      const jamaah = await Jamaah.findOne({
        where: { id: this.req.body.jamaah_id },
        include: {
          model: Agen,
          include: { model: Level_keagenan },
        },
      });

      const default_fee = jamaah?.Agen?.Level_keagenan?.default_fee ?? 0;
      const agen_id = jamaah?.Agen?.id ?? null;

      return { default_fee, agen_id };
    } catch (err) {
      console.error("Gagal ambil defaultFee:", err);
      return { default_fee: 0, agen_id: null };
    }
  }

  async Fee_agen() {
    try {
      const { default_fee, agen_id } = await this.defaultFee();
      const invoice = await this.generateInvoice();
      const now = moment().format("YYYY-MM-DD HH:mm:ss");

      return await Fee_agen.create(
        {
          company_id: this.company_id,
          agen_id,
          invoice,
          nominal: default_fee,
          status_bayar: "belum_lunas",
          info: "dari pinjaman jamaah",
          pembayaran_fee_agen_id: agen_id,
          createdAt: now,
          updatedAt: now,
        },
        { transaction: this.t }
      );
    } catch (err) {
      this.state = false;
      this.message = "Gagal membuat Fee_agen: " + err.message;
      console.error(err);
      return null;
    }
  }

  async Skema_peminjaman(peminjaman_id) {
    const { nominal, tenor, dp } = this.req.body;
    const utang = nominal - dp;
    let biaya_perbulan = Math.ceil(utang / tenor / 1000) * 1000;
    const sisaUtang = utang - biaya_perbulan * (tenor - 1);
    biaya_perbulan = biaya_perbulan > 0 ? biaya_perbulan : 1000;

    const skema = [];
    for (let i = 0; i < tenor; i++) {
      const jumlah = i === tenor - 1 ? sisaUtang : biaya_perbulan;
      skema.push({
        company_id: this.company_id,
        peminjaman_id,
        term: i + 1,
        nominal: jumlah,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Skema_peminjaman.bulkCreate(skema, { transaction: this.t });
  }

  async createPeminjaman() {
    await this.initialize();

    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const petugas = await this.petugas();
    const register_number = await this.register_number();
    const invoice = await this.generateInvoice();

    const { jamaah_id, nominal, tenor, dp, sudah_berangkat = false } = body;
    const peminjam_id = jamaah_id;

    try {
      const peminjamanBaru = await Peminjaman.create(
        {
          company_id: this.company_id,
          jamaah_id: peminjam_id,
          register_number,
          nominal,
          tenor: body.tenor,
          dp,
          petugas,
          status_peminjaman: 'belum_lunas',
          createdAt: now,
          updatedAt: now,
        },
        { transaction: this.t }
      );

      const peminjaman_id = peminjamanBaru.id;

      if (tenor && nominal) {
        await this.Skema_peminjaman(peminjaman_id);
      }

      if (dp > 0) {
        await Riwayat_pembayaran_peminjaman.create(
          {
            company_id: this.company_id,
            peminjaman_id,
            invoice,
            nominal: dp,
            status: "dp",
            petugas,
            createdAt: now,
            updatedAt: now,
          },
          { transaction: this.t }
        );
      }

      const saldoSebelum = await this.saldo();
      const saldoSesudah = saldoSebelum + nominal;

      const jamaahData = await Jamaah.findOne({ where: { id: peminjam_id } });
      const member_id = jamaahData?.member_id;

      if (!sudah_berangkat && member_id) {
        await Deposit.create(
          {
            company_id: this.company_id,
            member_id,
            invoice,
            nominal,
            saldo_sebelum: saldoSebelum,
            saldo_sesudah: saldoSesudah,
            sumber_dana: "cash",
            penerima: petugas,
            tipe_transaksi: "deposit",
            info: "dari peminjaman yang belum berangkat",
            createdAt: now,
            updatedAt: now,
          },
          { transaction: this.t }
        );
      }

      if (jamaahData?.agen_id) {
        await this.Fee_agen();
      }

      this.message = "Peminjaman berhasil dibuat";
    } catch (err) {
      this.state = false;
      this.message = "Gagal membuat peminjaman: " + err.message;
      console.error(err);
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
