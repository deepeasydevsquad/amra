const { 
  sequelize,
  Company,
  Division,
  Tabungan,
  Jamaah,
  Riwayat_tabungan,
  Refund_tabungan,
  Agen,
  Level_keagenan,
  Fee_agen,
  Member,
  Deposit,
  Jurnal,
 } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");
const { getJamaahInfo } = require("../../../helper/JamaahHelper");
const fs = require('fs');
const path = require('path');

class Model_cud {
  constructor(req) {
    this.req = req;
    this.division_id;
    this.company_id;
  } 

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async penerima() {
    this.tipe = await tipe(this.req);

    if (this.tipe === "administrator") {
      const company = await Company.findOne({
        where: { id: this.company_id },
      });
      return company?.company_name ?? "Unknown Company";
    }

    if (this.tipe === "staff") {
      const member = await Member.findOne({
        where: { company_id: this.company_id },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }

  async generateInvoice() {
  // Generate a 6-character alphanumeric invoice code
  const possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const possibleNumbers = "0123456789";
  let invoice;
  let exists;

  do {
    const lettersPart = Array.from({ length: 3 }, () =>
      possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length))
    ).join("");
    
    const numbersPart = Array.from({ length: 3 }, () =>
      possibleNumbers.charAt(Math.floor(Math.random() * possibleNumbers.length))
    ).join("");

    invoice = lettersPart + numbersPart;

    const [inRiwayat, inRefund, inDeposit] = await Promise.all([
      Riwayat_tabungan.findOne({
        where: { invoice },
        include: [{
          model: Tabungan,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }],
        }],
      }),
      Refund_tabungan.findOne({
        where: { invoice },
        include: [{
          model: Tabungan,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }],
        }],
      }),
      Deposit.findOne({ where: { invoice, company_id: this.company_id } }),
    ]);

    // pastikan invoice tidak ada yang sama di riwayat, refund, atau deposit
    exists = inRiwayat || inRefund || inDeposit;

  } while (exists);
    return invoice;
  }

  async generateInvoiceAgen() {
    const possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const possibleNumbers = "0123456789";
    let invoice;
    let exists;
    
    do {
      const lettersPart = Array.from({ length: 3 }, () =>
        possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length))
      ).join("");
      
      const numbersPart = Array.from({ length: 3 }, () =>
        possibleNumbers.charAt(Math.floor(Math.random() * possibleNumbers.length))
      ).join("");
      
      invoice = lettersPart + numbersPart;
      
      const inDeposit = await Fee_agen.findOne({ where: { invoice, company_id: this.company_id } });
      exists = inDeposit;
    } while (exists);
    return invoice;
  }
  
  // === CREATE ===
  async add() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    
    try {
      let invoiceTabungan, invoiceDeposit;
      do {
        invoiceTabungan = await this.generateInvoice();
        invoiceDeposit = await this.generateInvoice();
      } while (invoiceTabungan === invoiceDeposit); // pastikan invoice tabungan dan deposit tidak sama
      
      const penerima = await this.penerima();
      const jamaah = await getJamaahInfo(body.jamaah_id);

      console.log("Data Body:", body);
      console.log("Company ID:", this.company_id);
      console.log("Division ID:", this.division_id);
      console.log("Invoice Tabungan:", invoiceTabungan);
      console.log("Invoice Deposit:", invoiceDeposit);

      // === 1. Insert ke tabel TABUNGAN ===
      const tabungan = await Tabungan.create({
        division_id: this.division_id,
        jamaah_id: body.jamaah_id,
        target_paket_id: body.target_id,
        total_tabungan: body.biaya_deposit,
        status: 'active',
        fee_agen_id: null,
        batal_berangkat: 'tidak',
        transaksi_paket_id: body.transaksi_paket_id || null,
        sisa_pembelian: body.sisa_pembelian || 0,
        invoice_sisa_deposit: null,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // === 2. Insert ke tabel RIWAYAT_TABUNGAN ===
      await Riwayat_tabungan.create({
        invoice: invoiceTabungan,
        tabungan_id: tabungan.id,
        nominal_tabungan: body.biaya_deposit,
        penerima: penerima,
        sumber_dana: body.sumber_dana,
        saldo_tabungan_sebelum: 0,
        saldo_tabungan_sesudah: body.biaya_deposit,
        info_tabungan: body.info_deposit || null,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // === 3. Jika ada agen, insert ke FEE_KEAGENAN ===
      if (jamaah?.Agen) {
        const invoiceAgen = await this.generateInvoiceAgen();
        const agen = await Fee_agen.create({
          company_id: this.company_id,
          agen_id: jamaah.Agen.id,
          invoice: invoiceAgen,
          nominal: jamaah.Agen.Level_keagenan.default_fee || 0,
          status_bayar: 'belum_lunas',
          info: null,
          pembayaran_fee_agen_id: null,
          createdAt: dateNow,
          updatedAt: dateNow,
        }, { transaction: this.t });

        await tabungan.update({
          fee_agen_id: agen.id,
        }, {
          where: { id: tabungan.id },
          transaction: this.t,
        });
      }

      // === 4. Jika sumber dana adalah "Deposit", update data member dan insert ke DEPOSIT ===
      const member = jamaah?.Member;
      const sumberDana = body.sumber_dana.toLowerCase();

      if (sumberDana === "deposit") {
        // === Insert ke tabel DEPOSIT (log pengurangan) ===
        await Deposit.create({
          company_id: this.company_id,
          member_id: member.id,
          invoice: invoiceDeposit,
          nominal: -Number(body.biaya_deposit),
          saldo_sebelum: member.total_deposit,
          saldo_sesudah: Number(member.total_deposit) - Number(body.biaya_deposit),
          sumber_dana: body.sumber_dana,
          penerima: penerima,
          tipe_transaksi: "pindah_ke_tabungan",
          info: `Digunakan untuk tabungan umrah (invoice: ${invoiceTabungan})`,
          createdAt: dateNow,
          updatedAt: dateNow,
        }, { transaction: this.t });

        // === Update total deposit dan total tabungan ===
        await member.update({
          total_deposit: member.total_deposit - Number(body.biaya_deposit),
          total_tabungan: (member.total_tabungan || 0) + Number(body.biaya_deposit),
          updatedAt: dateNow
        }, { transaction: this.t });

      } else if (sumberDana === "cash") {
        // === Langsung tambahkan ke tabungan tanpa sentuh deposit ===
        await member.update({
          total_tabungan: Number(member.total_tabungan || 0) + Number(body.biaya_deposit),
          updatedAt: dateNow
        }, { transaction: this.t });
      }

      this.message = `Data tabungan berhasil disimpan dengan invoice: ${invoiceTabungan}`;
      return invoiceTabungan;
    } catch (error) {
      this.state = false;
    }
  }

  // === Menabung ===
  async Menabung() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info tabungan
      const infoTabungan = await model_r.infoTabungan(body.id, this.division_id);

      let invoiceTabungan, invoiceDeposit;
      do {
        invoiceTabungan = await this.generateInvoice();
        invoiceDeposit = await this.generateInvoice();
      } while (invoiceTabungan === invoiceDeposit); // pastikan invoice tabungan dan deposit tidak sama

      const penerima = await this.penerima();

      console.log("Data Body:", body);
      console.log("Company ID:", this.company_id);
      console.log("Division ID:", this.division_id);
      console.log("Invoice Tabungan:", invoiceTabungan);
      console.log("Invoice Deposit:", invoiceDeposit);

      const tabungan = await Tabungan.findOne({ where: { id: body.id, division_id: this.division_id } });

      tabungan.update({
        total_tabungan: (infoTabungan.total_tabungan || 0) + Number(body.biaya_deposit),
        updatedAt: dateNow
      }, { transaction: this.t })

      // === Insert ke tabel RIWAYAT_TABUNGAN ===
      await Riwayat_tabungan.create({
        invoice: invoiceTabungan,
        tabungan_id: tabungan.id,
        nominal_tabungan: body.biaya_deposit,
        penerima: penerima,
        sumber_dana: body.sumber_dana,
        saldo_tabungan_sebelum: infoTabungan.total_tabungan,
        saldo_tabungan_sesudah: (infoTabungan.total_tabungan || 0) + Number(body.biaya_deposit),
        info_tabungan: body.info_deposit || null,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      const member = await Member.findOne({
        where: { id: infoTabungan.jamaah.id },
        transaction: this.t,
      });
      const sumberDana = body.sumber_dana.toLowerCase();
      if (sumberDana === "deposit") {

        // === Insert ke tabel DEPOSIT (log pengurangan) ===
        await Deposit.create({
          company_id: this.company_id,
          member_id: member.id,
          invoice: invoiceDeposit,
          nominal: -Number(body.biaya_deposit),
          saldo_sebelum: member.total_deposit,
          saldo_sesudah: Number(member.total_deposit) - Number(body.biaya_deposit),
          sumber_dana: body.sumber_dana,
          penerima: penerima,
          tipe_transaksi: "pindah_ke_tabungan",
          info: `Digunakan untuk tabungan umrah (invoice: ${invoiceTabungan})`,
          createdAt: dateNow,
          updatedAt: dateNow,
        }, { transaction: this.t });

        // === Update total deposit dan total tabungan ===
        await member.update({
          total_deposit: member.total_deposit - Number(body.biaya_deposit),
          total_tabungan: (member.total_tabungan || 0) + Number(body.biaya_deposit),
          updatedAt: dateNow
        }, { transaction: this.t });

      } else if (sumberDana === "cash") {
        // === Langsung tambahkan ke tabungan tanpa sentuh deposit ===
        await member.update({
          total_tabungan: Number(member.total_tabungan || 0) + Number(body.biaya_deposit),
          updatedAt: dateNow
        }, { transaction: this.t });
      }
      
      this.message = `Menambahkan tabungan umrah nama jamaah: ${infoTabungan.jamaah.fullname} dengan invoice: ${invoiceTabungan}`;
    } catch (error) {
      this.state = false;
    }
  }

  // === Refund ===
  async Refund() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info tabungan
      const infoTabungan = await model_r.infoTabungan(body.id, this.division_id);
      const penerima = await this.penerima();

      let invoiceTabungan, invoiceRefund;
      do {
        invoiceTabungan = await this.generateInvoice();
        invoiceRefund = await this.generateInvoice();
      } while (invoiceTabungan === invoiceRefund); // pastikan invoice tabungan dan deposit tidak sama

      console.log("Data Body:", body);
      console.log("Company ID:", this.company_id);
      console.log("Division ID:", this.division_id);
      console.log("Invoice Refund:", invoiceRefund);

      const tabungan = await Tabungan.findOne({ where: { id: body.id, division_id: this.division_id } });

      tabungan.update({
        total_tabungan: (infoTabungan.total_tabungan || 0) - Number(body.refund_nominal),
        batal_berangkat: Number(body.batal_berangkat) === 1 ? "ya" : "tidak",
        updatedAt: dateNow
      }, { transaction: this.t })

      // === Insert ke tabel RIWAYAT_TABUNGAN ===
      await Riwayat_tabungan.create({
        invoice: invoiceTabungan,
        tabungan_id: tabungan.id,
        nominal_tabungan: -Number(body.refund_nominal),
        penerima: penerima,
        sumber_dana: "cash",
        saldo_tabungan_sebelum: infoTabungan.total_tabungan,
        saldo_tabungan_sesudah: (infoTabungan.total_tabungan || 0) - Number(body.refund_nominal),
        info_tabungan: `Refund tabungan umrah (invoice: ${invoiceTabungan})`,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // === Insert ke tabel REFUND_TABUNGAN ===
      await Refund_tabungan.create({
        invoice: invoiceRefund,
        tabungan_id: tabungan.id,
        nominal_ditahan: null,
        nominal_refund: Number(body.refund_nominal),
        petugas_refund: penerima,
        info: `Refund tabungan umrah (invoice: ${invoiceRefund})`,
        saldo_tabungan_sebelum: infoTabungan.total_tabungan,
        saldo_tabungan_sesudah: (infoTabungan.total_tabungan || 0) - Number(body.refund_nominal),
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      const member = await Member.findOne({
        where: { id: infoTabungan.jamaah.id },
        transaction: this.t,
      });

      // === Update total tabungan ===
      await member.update({
        total_tabungan: (member.total_tabungan || 0) - Number(body.refund_nominal),
        updatedAt: dateNow
      }, { transaction: this.t });
      
      this.message = `Refund tabungan umrah nama jamaah: ${infoTabungan.jamaah.fullname} dengan invoice: ${invoiceRefund}`;
    } catch (error) {
      this.state = false;
    }
  }

  // ==== UPDATE TARGET PAKET ====
  async updateTargetPaket() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const tabungan = await Tabungan.findOne({
        where: { id: body.id },
        transaction: this.t,
      });

      if (!tabungan) throw new Error(`Data tabungan id: ${body.id} tidak ditemukan.`);

      await tabungan.update({
        target_paket_id: body.target_id,
        updatedAt: dateNow,
      }, { transaction: this.t });

    } catch (error) {
      this.state = false;
      this.message = error.message || "Terjadi kesalahan saat mengupdate data tabungan.";
    }
  }

  // ==== DELETE ====
  async delete() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info tabungan
      const infoTabungan = await model_r.infoTabungan(body.id, this.company_id);

      const tabungan = await Tabungan.findOne({
        where: { id: body.id },
        include: [
          {
            model: Riwayat_tabungan,
            order: [["id", "DESC"]],
            limit: 1,
          },
          {
            model: Jamaah,
          },
        ],
        transaction: this.t,
      });

      const member = await Member.findOne({
        where: { id: infoTabungan.jamaah.id },
        transaction: this.t,
      });

      const nominalTerakhir = tabungan.total_tabungan;
      const saldoSebelum = member.total_deposit;
      const saldoSesudah = saldoSebelum + nominalTerakhir;

      // 1. Tambahkan kembali saldo tabungan ke deposit member
      await member.update({
        total_deposit: saldoSesudah,
        total_tabungan: member.total_tabungan - nominalTerakhir,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // 2. Buat catatan log deposit (pengembalian)
      const invoiceDeposit = await this.generateInvoice();
      const penerima = await this.penerima();

      await Deposit.create({
        company_id: this.company_id,
        member_id: member.id,
        invoice: invoiceDeposit,
        nominal: nominalTerakhir,
        saldo_sebelum: saldoSebelum,
        saldo_sesudah: saldoSesudah,
        sumber_dana: "deposit",
        penerima: penerima,
        tipe_transaksi: "deposit",
        info: `Pengembalian dari pembatalan tabungan umrah: ${infoTabungan.jamaah.fullname}`,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // 3. Hapus Riwayat Tabungan
      await Riwayat_tabungan.destroy({
        where: { tabungan_id: tabungan.id },
        transaction: this.t,
      });

      // 4. Hapus Tabungan
      await Tabungan.destroy({
        where: { id: tabungan.id },
        transaction: this.t,
      });

      await Fee_agen.destroy({
        where: { id: tabungan.fee_agen_id },
        transaction: this.t,
      });

      this.message = `Tabungan ID ${tabungan.id} berhasil dihapus. Dana sebesar ${nominalTerakhir} dikembalikan ke deposit.`;
    } catch (error) {
      console.error("Error deleting tabungan:", error);
      this.state = false;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      // commit
      await this.t.commit();
      return true;
    } else {
      // rollback
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
