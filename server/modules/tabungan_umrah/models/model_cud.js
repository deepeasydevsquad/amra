const { 
  Company,
  Paket,
  Tabungan,
  Jamaah,
  Riwayat_tabungan,
  Agen,
  Level_keagenan,
  Fee_agen,
  Member,
  Deposit,
  Jurnal,
 } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const moment = require("moment");
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
    // generate kode number, kode number format : 6 random alphanumeric characters
    const possibleAbjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const possibleAngka = "0123456789";
    
    let invoice;
    let sama;
  
    do {
      invoice = Array.from({ length: 3 }, () =>
        possibleAbjad.charAt(Math.floor(Math.random() * possibleAbjad.length))
      ).join("") +
      Array.from({ length: 3 }, () =>
        possibleAngka.charAt(Math.floor(Math.random() * possibleAngka.length))
      ).join("");

      const [inRiwayat, inDeposit, inFee] = await Promise.all([
        Riwayat_tabungan.findOne({ where: { invoice: invoice } }),
        Deposit.findOne({ where: { invoice: invoice } }),
        Fee_agen.findOne({ where: { invoice: invoice } }),
      ]);
  
      sama = inRiwayat || inDeposit || inFee;
  
    } while (sama);
  
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
        fee_agen_id: body.fee_agen_id || null,
        batal_berangkat: body.batal_berangkat || 'tidak',
        transaksi_paket_id: body.transaksi_paket_id || null,
        sisa_pembelian: body.sisa_pembelian || 0,
        invoice_sisa_deposit: invoiceTabungan,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // === 2. Insert ke tabel RIWAYAT_TABUNGAN ===
      await Riwayat_tabungan.create({
        invoice: invoiceTabungan,
        tabungan_id: tabungan.id,
        nominal_tabungan: body.biaya_deposit,
        penerima: this.penerima(),
        sumber_dana: body.sumber_dana,
        saldo_tabungan_sebelum: 0,
        saldo_tabungan_sesudah: body.biaya_deposit,
        info_tabungan: body.info_deposit || null,
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // === 3. Jika ada agen, insert ke FEE_KEAGENAN ===
      // if (body.fee_agen_id) {
      //   await Fee_agen.create({
      //     company_id: this.company_id,
      //     agen_id: body.fee_agen_id,
      //     invoice: invoice,
      //     nominal: body.nominal_fee || 0,
      //     status_bayar: 'belum_bayar',
      //     info: body.info_fee || null,
      //     pembayaran_fee_agen_id: body.fee_agen_id,
      //     createdAt: dateNow,
      //     updatedAt: dateNow,
      //   }, { transaction: this.t });
      // }

      // === 4. Jika sumber dana adalah "Deposit", update data member dan insert ke DEPOSIT ===
      if (body.sumber_dana.toLowerCase() === "deposit") {
        // Kurangi total deposit di tabel MEMBER
        const member = await Member.findOne({ where: { jamaah_id: body.jamaah_id } });
        if (!member || member.total_deposit < body.biaya_deposit) {
          throw new Error("Deposit tidak mencukupi.");
        }

        await member.update({
          total_deposit: member.total_deposit - body.biaya_deposit,
          updatedAt: dateNow
        }, { transaction: this.t });

        // Insert ke tabel DEPOSIT (log pengurangan)
        await Deposit.create({
          company_id: this.company_id,
          member_id: member.id,
          invoice: invoiceDeposit,
          nominal: -body.biaya_deposit,
          saldo_sebelum: member.total_deposit,
          saldo_sesudah: member.total_deposit - body.biaya_deposit,
          sumber_dana: body.sumber_dana,
          penerima: this.penerima(),
          tipe_transaksi: "deposit",
          info: `Digunakan untuk tabungan umrah (invoice: ${invoiceTabungan})`,
          createdAt: dateNow,
          updatedAt: dateNow,
        }, { transaction: this.t });
      }

      this.message = `Data tabungan berhasil disimpan dengan invoice: ${invoiceTabungan}`;
    } catch (error) {
      console.log("=========================")
      console.log("Error:", error);
      console.log("=========================")
      this.state = false;
      this.message = error.message || "Terjadi kesalahan saat menyimpan data tabungan.";
    }
  }

  // Hapus paket
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info paket
      console.log("Body ID:", body.id);
      console.log("Division ID:", this.division_id);
      const paketInfo = await model_r.infoPaket(body.id, this.division_id);

      // delete process
      // get paket price info
      const paketPriceInfo = await Paket_price.findAll({
        where: {
          paket_id: paketInfo.id,
        },
        transaction: this.t,
      });

      console.log("Paket Price Info:", paketPriceInfo);
      // delete paket price
      if (paketPriceInfo.length > 0) {
        await Paket_price.destroy({
          where: {
            paket_id: paketInfo.id,
          },
          transaction: this.t,
        });
      }

      // Ambil nama file saja dan buat path lengkap
      const fileName = path.basename(paketInfo.photo); // Ambil nama file
      const filePath = path.resolve(__dirname, '../../../uploads/daftar_paket', fileName);

      // Cek dan hapus file 
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }

      // delete paket
      await Paket.destroy(
        {
          where: {
            id: body.id,
            division_id: this.division_id,
          },
          transaction: this.t,
        }
      );

      this.state = true;
      // write log message
      this.message = `Menghapus paket dengan Kode: ${paketInfo.kode}, Nama : ${paketInfo.name} dan ID : ${paketInfo.id}`;
    } catch (error) {
      console.error("Error deleting paket:", error);
      this.state = false;
    }
  }

  // response
  async response() {
    console.log("RESPONDING: state =", this.state);
    if (this.state) {
      console.log("Committing transaction...");
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return true;
    } else {
      console.log("Rolling back transaction...");
      await this.t.rollback();
      return false;
    }
  }
  
}

module.exports = Model_cud;
