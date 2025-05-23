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
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.company_id = null;
    this.message = "";
    this.t = null;
    this.state = true;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
  }

  async mengambil_total_deposit() {
    try {
      const jamaah = await Jamaah.findOne({
        where: { id: this.req.body.jamaah_id },
        include: {
          required : true, 
          model : Member, 
          attribute : ['total_deposit']
        }
      });
      return jamaah.Member.total_deposit;

    } catch (error) {
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
    return `${randomChar()}${randomChar()}${Array.from({ length: 8 },digits).join("")}`;
  }

  async generateInvoice() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let huruf = "", angka = "";
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
      return { default_fee: 0, agen_id: null };
    }
  }


  async Skema_peminjaman(peminjaman_id) {
    const { nominal, tenor, dp, mulai_bayar } = this.req.body;
    const utang = nominal - dp;
    let biaya_perbulan = Math.ceil(utang / tenor / 1000) * 1000;
    const sisaUtang = utang - biaya_perbulan * (tenor - 1);
    biaya_perbulan = biaya_perbulan > 0 ? biaya_perbulan : 1000;

    const skema = [];
    for (let i = 0; i < tenor; i++) {
      const jumlah = i === tenor - 1 ? sisaUtang : biaya_perbulan;
      const tanggalJatuhTempo = moment(mulai_bayar).add(i, 'months').format('YYYY-MM-DD');

      skema.push({
        company_id: this.company_id,
        peminjaman_id,
        term: i + 1,
        nominal: jumlah,
        duedate: tanggalJatuhTempo , 
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Skema_peminjaman.bulkCreate(skema, { transaction: this.t });
  }

  async createPeminjaman() {
    await this.initialize();

    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const { jamaah_id, nominal, tenor, dp, sudah_berangkat = false } = this.req.body;
    const petugas = await this.petugas();
    const register_number = await this.register_number();
    
    
    const invoice = await this.generateInvoice();


    const total_deposit = await this.mengambil_total_deposit();

    try {
      // Insert data Peminjaman baru
      const IP = await Peminjaman.create(
        {
          company_id: this.company_id,
          jamaah_id,
          register_number,
          nominal,
          tenor,
          dp,
          petugas,
          status_peminjaman: "belum_lunas",
          createdAt: now,
          updatedAt: now,
        },
        { transaction: this.t }
      );

      if (tenor && nominal) {
        //membuat skema peminjaman
        await this.Skema_peminjaman(IP.id);
      }

      if (dp > 0) {
        // menginput riwayat pembayara jika ada DP
        await Riwayat_pembayaran_peminjaman.create(
          {
            company_id: this.company_id,
            peminjaman_id : IP.id,
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

      // const jamaah = await Jamaah.findOne({
      //   where: { id: this.req.body.jamaah_id },
      //   include: {
      //     required : true, 
      //     model : Member, 
      //     attribute : ['total_deposit']
      //   }
      // });

      const saldoSebelum = jamaah.Member.total_deposit;
      const saldoSesudah = saldoSebelum + nominal;

      const jamaahData = await Jamaah.findOne({ where: { id: jamaah_id } });
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

      // tambah fee agen jika ada
      if (jamaahData?.agen_id) {
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
            createdAt: now,
            updatedAt: now,
          },
          { transaction: this.t }
        );
      }

      this.message = "Peminjaman berhasil dibuat";
    } catch (err) {
      this.state = false;
      this.message = "Gagal membuat peminjaman: " + err.message;
      console.error(err);
    }
  }

  async updateSkema() {

    await this.initialize(); // bikin this.t

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const { peminjaman_id, updatedSkema } = this.req.body;
      // delete skema peminjaman
      await Skema_peminjaman.destroy(
        {
          where: {
            peminjaman_id: peminjaman_id,
            company_id : this.company_id
          },
        },
        {
          transaction: this.t,
        }
      );
      // create new skema peminjaman
      for( let x in updatedSkema) {
        await Skema_peminjaman.create(
            {
              company_id: this.company_id,
              peminjaman_id: peminjaman_id,
              term : updatedSkema[x].term, 
              nominal: updatedSkema[x].nominal, 
              duedate : updatedSkema[x].duedate,  
              createdAt: now,
              updatedAt: now,
            },
            { transaction: this.t }
          );
      }
     
      this.message = "Skema berhasil diperbarui";

    } catch (err) {
      this.state = false;
      this.message = "Gagal memperbarui skema: " + err.message;
      console.error("updateSkema Error:", err);
    }
  }

  async generateInvoicePembayaran() {
    const prefix = "BYR-";
    const year = new Date().getFullYear();

    const randomAlphanumeric = (length) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    const invoiceCode = `${prefix}${year}${randomAlphanumeric(6)}`;
    return invoiceCode;
  }

  async pembayaranPerbulan() {
    await this.initialize();

    const { peminjaman_id, nominal } = this.req.body;
    this.invoice = await this.generateInvoicePembayaran(); // Simpan invoice dalam properti ini
    const petugas = await this.petugas();
    const status = "cicilan";
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("data dari front end:", this.req.body);

    try {
      await Riwayat_pembayaran_peminjaman.create(
        {
          company_id: this.company_id,
          peminjaman_id,
          invoice: this.invoice, // Gunakan invoice yang sudah disimpan
          nominal,
          petugas,
          status,
          createdAt: now,
          updatedAt: now,
        },
        { transaction: this.t }
      );

      this.message = "Pembayaran perbulan berhasil dibuat"; // Set message
    } catch (err) {
      this.state = false;
      this.message = "Gagal membuat pembayaran perbulan: " + err.message;
      console.error("pembayaranPerbulan Error:", err);
    }
  }

  async response() {
    console.log("~~~~~~~~~~~~~~~~~");
    console.log(this.message);
    console.log(this.state);
    console.log("~~~~~~~~~~~~~~~~~");

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
