const { 
  sequelize,
  Op,
  Sequelize,
  Company,
  Division,
  Paket_transaction,
  Paket_transaction_payment_history,
  Tabungan,
  Riwayat_tabungan,
  Refund_tabungan,
  Member,
  Deposit,
  Handover_fasilitas,
  Handover_fasilitas_detail_paket,
  Handover_fasilitas_paket,
  Handover_barang,
  Handover_barang_paket,
  Jurnal,
  } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

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

    const [inRiwayat, inRefund, inDeposit, inPaketPaymentHistory] = await Promise.all([
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
      Paket_transaction_payment_history.findOne({ 
        where: { invoice },
        include: [{
          model: Paket_transaction,
          where: { division_id: this.division_id },
        }],
      }),
    ]);

    // pastikan invoice tidak ada yang sama di riwayat, refund, deposit, atau PaketPaymentHistory
    exists = inRiwayat || inRefund || inDeposit || inPaketPaymentHistory;

  } while (exists);
    return invoice;
  }

  async generateInvoiceHandover() {
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
      
      const inHandoverFasilitas = await Handover_fasilitas.findOne({
        where: { invoice },
        include: [{
          model: Tabungan,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }],
        }],
      });

      const inHandoverFasilitasPaket = await Handover_fasilitas_paket.findOne({
        where: { invoice },
        include: [{
          model: Paket_transaction,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }]
        }]
      })

      const inHandoverBarang = await Handover_barang.findOne({
        where: {
          [Op.or]: [
            { invoice_handover: invoice },
            { invoice_returned: invoice },
          ],
        },
        include: [{
          model: Tabungan,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }],
        }],
      });

      const inHandoverBarangPaket = await Handover_barang_paket.findOne({
        where: {
          [Op.or]: [
            { invoice_handover: invoice },
            { invoice_returned: invoice },
          ]
        },
        include: [{
          model: Paket_transaction,
          include: [{
            model: Division,
            where: { company_id: this.company_id },
          }],
        }],
      });

      exists = inHandoverFasilitas || inHandoverBarang || inHandoverFasilitasPaket || inHandoverBarangPaket;
    } while (exists);
    return invoice;
  }
  
  // ==== SERAH TERIMA FASILITAS ====
  async addHandoverFasilitasPaket() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    
    try {
      const invoiceHandover = await this.generateInvoiceHandover();
      const penerima = await this.penerima();

      const handoverFasilitas = await Handover_fasilitas_paket.create({
        paket_transaction_id: body.id,
        invoice: invoiceHandover,
        petugas: penerima,
        penerima: body.penerima,
        nomor_identitas_penerima: body.nomor_identitas_penerima || null,  
        createdAt: dateNow,
        updatedAt: dateNow,
      }, { transaction: this.t });

      // Insert detail handover fasilitas
      for (const fasilitas_id of body.detail_fasilitas) {
        await Handover_fasilitas_detail_paket.create({  
          handover_fasilitas_paket_id: handoverFasilitas.id,
          mst_fasilitas_id: fasilitas_id,
          createdAt: dateNow,
          updatedAt: dateNow,
        }, { transaction: this.t });
      }

      this.message = `Handover fasilitas paket berhasil ditambahkan untuk paket transaksi ID ${body.id} dengan invoice: ${invoiceHandover}`;
      return invoiceHandover;
    } catch (error) {
      this.state = false;
      this.message = error.message || "Terjadi kesalahan saat menambahkan handover fasilitas.";
    }
  }

  // === SERAH TERIMA BARANG ===
  async addHandoverBarangPaket() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info tabungan
      const infoDaftarJamaahPaket = await model_r.infoDaftarJamaahPaket(body.id, this.division_id);
      const penerima = await this.penerima();
      const invoice_handover = await this.generateInvoiceHandover();

      const dataBarangList = body.barangList.map(barang => ({
        paket_transaction_id: body.id,
        invoice_handover: invoice_handover,
        jamaah_id: infoDaftarJamaahPaket.Jamaah.id,
        nama_barang: barang,
        status: 'diambil',  
        giver_handover: body.giver_handover,
        giver_handover_identity: body.giver_handover_identity,
        giver_handover_hp: body.giver_handover_hp,
        giver_handover_address: body.giver_handover_address,
        receiver_handover: penerima,
        date_taken: dateNow,
        createdAt: dateNow,
        updatedAt: dateNow,
      }));
      await Handover_barang_paket.bulkCreate(dataBarangList, { transaction: this.t });

      this.message = `Handover barang berhasil ditambahkan untuk transaksi paket ID ${body.id} dengan nama jamaah ${infoDaftarJamaahPaket.Member.fullname} dan invoice: ${invoice_handover}`;
      return invoice_handover;
    } catch (error) {
      this.state = false;
      this.message = error.message || "Terjadi kesalahan saat menambahkan handover barang.";
      console.log("================ Add Handover Barang ================");
      console.log(error)
      console.log("================ Add Handover Barang ================");
    }
  }

  // === PENGEMBALIAN BARANG ===
  async pengembalianHandoverBarangPaket() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call object
      const model_r = new Model_r(this.req);
      // get info tabungan
      const infoDaftarJamaahPaket = await model_r.infoDaftarJamaahPaket(body.id, this.division_id);
      const penerima = await this.penerima();
      const invoice_returned = await this.generateInvoiceHandover();

      const dataBarangList = body.selectedItems.map(barangId => ({
        where: {
          id: barangId,
          paket_transaction_id: body.id,
        },
        updates: {
          invoice_returned: invoice_returned,
          giver_returned: penerima,
          receiver_returned: body.receiver_returned,
          receiver_returned_identity: body.receiver_returned_identity,
          receiver_returned_hp: body.receiver_returned_hp,
          receiver_returned_address: body.receiver_returned_address,
          status: 'dikembalikan',
          date_returned: dateNow,
          updatedAt: dateNow,
        },
      }));
      for (const barang of dataBarangList) {
        await Handover_barang_paket.update(
          barang.updates,
          {
            where: barang.where,
            transaction: this.t,
          }
        );
      }

      this.message = `Pengembalian barang berhasil ditambahkan untuk transaksi dengan nama jamaah ${infoDaftarJamaahPaket.Member.fullname} dan invoice: ${invoice_returned}`;
      return invoice_returned;      
    } catch (error) {
      this.state = false;
      this.message = error.message || "Terjadi kesalahan saat menambahkan PengembalianHandoverBarang.";
      console.log("================ PengembalianHandoverBarang ================");
      console.log(error)
      console.log("================ PengembalianHandoverBarang ================");
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
