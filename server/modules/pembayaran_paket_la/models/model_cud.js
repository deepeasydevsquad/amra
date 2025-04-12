const { sequelize, Paket_la,Paket_la_transaction, Company } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.tipe = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async generateInvoiceNumber(paketlaId) {
    // generate invoice number, invoice number format : 6 random alphanumeric characters
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    let invoiceNumber;
    let sama;
  
    do {
      invoiceNumber = Array.from({ length: 6 }, () =>
        possible.charAt(Math.floor(Math.random() * possible.length))
      ).join("");

      const [inTransaction, inRegister] = await Promise.all([
        Paket_la_transaction.findOne({ where: { invoice: invoiceNumber } }),
        Paket_la.findOne({ where: { id: paketlaId, register_number: invoiceNumber } }),
      ]);
  
      sama = inTransaction || inRegister;
  
    } while (sama);
  
    return invoiceNumber;
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
        where: { company_id: this.company_id, role: "staff" },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }

  async validatePaymentAmount(paketlaId, paid, infoPembayaranPaketLA) {
    try {
      const paketla = await Paket_la.findByPk(paketlaId);
      
      console.group("======== Validasi Pembayaran Paket LA ======="); // Memulai grup log debugging
      console.log("Paket LA:", paketla);
      console.log("Jumlah Bayar:", paid);
      console.log("Total Harga Paket LA:", paketla.total_price);
      
      const kelebihan = infoPembayaranPaketLA.item_transaksi.reduce((total, trx) => total + Number(trx.paid), 0) + Number(paid); // Menghitung total jumlah bayar
      
      console.log("Kelebihan:", kelebihan);
      console.log("Validasi:", kelebihan <= paketla.total_price ? "Valid" : "Tidak Valid");
      console.log("===========================================");
      console.groupEnd();
      
      if (!paketla) {
        return { valid: false, message: "Data Paket LA tidak ditemukan." };
      }

      if (kelebihan > paketla.total_price) { return { valid: false, message: "Jumlah bayar tidak boleh lebih besar dari total harga Paket LA." }; }

      return { valid: true, paketla };
    } catch (error) {
      return { valid: false, message: `Terjadi kesalahan saat memvalidasi pembayaran: ${error.message}` };
    }
  }
  

  // Tambah  paket la
  async add() {
    // initialize dependensi propertiesA
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("Body:", body);
    console.log("Company ID:", this.company_id);
  
    // call object
    const model_r = new Model_r(this.req);
    // get info  paket la
    const infoPembayaranPaketLA = await model_r.infoPembayaranPaketLA(body.paketlaId, this.company_id);

    const { valid, message } = await this.validatePaymentAmount(body.paketlaId, body.paid, infoPembayaranPaketLA);
    const invoice = await this.generateInvoiceNumber(body.paketlaId);
    const penerima = await this.penerima();
    
    if (!valid) {
      this.state = false;
      this.message = message;
      return false;
    }

    try {
      // insert process
      const insert = await Paket_la_transaction.create(
        {
          company_id: this.company_id,
          paket_la_id: body.paketlaId,
          invoice: invoice,
          paid: body.paid,
          status: "payment",
          receiver: penerima,
          deposit_name: body.deposit_name,
          deposit_hp_number: body.deposit_hp_number,
          deposit_address: body.deposit_address,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      // write log message
      this.message = `Menambahkan pembayaran paket la Baru dengan Nomor invoice : ${invoice}, Nama petugas : ${penerima} dan ID pembayaran paket la : ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  // // Edit  paket la
  // async update() {
  //   // initialize general property
  //   await this.initialize();
  //   const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  //   const body = this.req.body;

  //   // update process
  //   try {
  //     // call object
  //     const model_r = new Model_r(this.req);
  //     // get info  paket la
  //     const infoPaketLA = await model_r.infoPaketLA(body.id, this.company_id);
  //     // update data  paket la
  //     await Paket_la_transaction.update(
  //       {
  //         kostumer_paket_la_id: body.kostumer_paket_la_id,
  //         client_name: body.client_name,
  //         client_hp_number: body.client_hp_number,
  //         client_address: body.client_address,
  //         discount: body.discount,
  //         total_jamaah: body.total_jamaah,
  //         departure_date: body.departure_date,
  //         arrival_date: body.arrival_date,
  //         updatedAt: myDate,
  //       },
  //       {
  //         where: { id: body.id, company_id: this.company_id },
  //       },
  //       {
  //         transaction: this.t,
  //       }
  //     );
  //     // write log message
  //     this.message = `Memperbaharui Data paket la dengan Nomor Registrasi : ${infoPaketLA.invoice}, Nama klien ${infoPaketLA.client_name} dan ID paket la : ${body.id} menjadi Nama klien ${body.client_name}`; 
  //   } catch (error) {
  //     this.state = false;
  //   }
  // }

  // // Hapus  paket la
  // async delete() {
  //   // initialize dependensi properties
  //   await this.initialize();
  //   const body = this.req.body;
  //   try {
  //     // call object
  //     const model_r = new Model_r(this.req);
  //     // get info  paket la
  //     const infoPaketLA = await model_r.infoPaketLA(body.id, this.company_id);
  //     // delete process
  //     await Paket_la_transaction.destroy(
  //       {
  //         where: {
  //           id: body.id,
  //           company_id: this.company_id,
  //         },
  //       },
  //       {
  //         transaction: this.t,
  //       }
  //     );
  //     // write log message
  //     this.message = `Menghapus paket la dengan Nomor Registrasi : ${infoPaketLA.invoice}, Nama klien : ${infoPaketLA.client_name} dan ID paket la : ${infoPaketLA.id}`;
  //   } catch (error) {
  //     this.state = false;
  //   }
  // }

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
