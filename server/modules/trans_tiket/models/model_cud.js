const { sequelize, Ticket_transaction, Ticket_payment_history, Jurnal, Mst_airline, Division, Op } = require("../../../models");
const { getCabang, getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const { writeLog } = require("../../../helper/writeLogHelper");
const { generateNomorRegisterTicket, generateNomorInvoicePembayaranTicket } = require("../../../helper/randomHelper");
const moment = require("moment");

//const Model_r = require("../models/model_r");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.division_id;
    this.company_id;
  }
  async initialize() {
    this.t = await sequelize.transaction();
    this.division_id = await getCabang(this.req);
    this.company_id = await getCompanyIdByCode(this.req);
    this.type = await tipe(this.req);
    this.state = true;
  }

  // === GENERATE UNIQUE NOMOR INVOICE
  async generateNomorInvoice() {
    try {
      const nomorInvoice =
        await Ticket_payment_history.generateUniqueNomorInvoice();
      return {
        status: 200,
        message: "Nomor Invoice Berhasil Digenerate",
        data: { invoice: nomorInvoice },
      };
    } catch (error) {
      return {
        status: 200,
        message: "Nomor Invoice Gagal digenerate",
        data: {},
      };
    }
  }
  // === GENERATE UNIQUE NOMOR REGISTER
  async generateNomorRegister() {
    try {
      const nomorRegister =
        await Ticket_transaction.generateUniqueNomorRegister();
      return {
        status: 200,
        message: "Nomor Register Berhasil Digenerate",
        data: { nomor_register: nomorRegister },
      };
      // res.status(200).json({ nomor_register: nomorRegister });
    } catch (error) {
      return {
        status: 200,
        message: "Nomor Register Gagal digenerate",
        data: {},
      };
      //res.status(500).json({ message: 'Failed to generate nomor_register', error: error.message });
    }
  }
  // === CREATE ===
  async add() {
    await this.initialize();
    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
 
    try {
      const dibayar = body.dibayar;
      // generate nomor_register 
      const nomor_register = await generateNomorRegisterTicket(body.cabang);


      console.log("xxx");
      console.log(nomor_register);
      console.log("xxx");
      // get info maskapai
      const q = await Mst_airline.findOne({ where: {company_id: this.company_id, id: body.maskapai } });
      // total 
      const total = body.pax * body.harga_kostumer;
      // insert ke table Ticket_transactions
      const insert = await Ticket_transaction.create(
        {
          division_id: this.division_id,
          nomor_registrasi: nomor_register,
          airlines_id: body.maskapai, 
          kostumer_id: body.kostumer == 0 ? null : body.kostumer, 
          paket_id: body.paket == 0 ? null : body.paket, 
          status: 'active', 
          pax: body.pax, 
          code_booking: body.kode_booking, 
          travel_price: body.harga_travel, 
          costumer_price: body.harga_kostumer, 
          departure_date: body.tanggal_keberangkatan, 
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );
      // insert HPP Jurnal
      await Jurnal.create(
      {
        division_id: body.cabang, 
        source: 'ticketTransactionId:' + insert.id,
        ref: 'HPP Penjualan Tiket ' + q.name,
        ket: 'HPP Penjualan Tiket ' + q.name,
        akun_debet: q.nomor_akun_hpp,
        akun_kredit: q.nomor_akun_deposit,
        saldo: body.harga_travel,
        removable: 'false',
        periode_id: 0,
        createdAt: myDate,
        updatedAt: myDate,
      },
      {
        transaction: this.t,
      });

      if( body.dibayar > 0 ) {
        const invoice = await generateNomorInvoicePembayaranTicket(body.cabang);
        await Ticket_payment_history.create(
          {
            ticket_transaction_id: insert.id,
            invoice: invoice,
            nominal: body.dibayar,
            status: "cash",
            petugas: this.type,
          },
          { transaction: this.t }
        );
        
        // jika pembayaran tidak dilakukan secara full
        if( body.dibayar < total ) {
          // insert Kas Atau Pembayaran Utang Tabungan 
          await Jurnal.create(
            {
              division_id: body.cabang, 
              source: 'ticketTransactionId:' + insert.id,
              ref: 'Kas / Pembayaran utang untuk Penjualan Tiket ' + q.name,
              ket: 'Kas / Pembayaran utang untuk Penjualan Tiket ' + q.name,
              akun_debet: body.paket ? '23000' : '11010',
              akun_kredit: null,
              saldo: body.dibayar,
              removable: 'false',
              periode_id: 0,
              createdAt: myDate,
              updatedAt: myDate,
            },
            {
              transaction: this.t,
            }
          );
          // Insert Piutang 
          await Jurnal.create(
            {
              division_id: body.cabang, 
              source: 'ticketTransactionId:' + insert.id,
              ref: 'Piutang untuk Penjualan Tiket ' + q.name,
              ket: 'Piutang untuk Penjualan Tiket ' + q.name,
              akun_debet: '13000',
              akun_kredit: null,
              saldo: total - body.dibayar,
              removable: 'false',
              periode_id: 0,
              createdAt: myDate,
              updatedAt: myDate,
            },
            {
              transaction: this.t,
            }
          );
          // Insert Pendatapatan Maskapai 
          await Jurnal.create(
            {
              division_id: body.cabang, 
              source: 'ticketTransactionId:' + insert.id,
              ref: 'Pendapatan untuk Penjualan Tiket ' + q.name,
              ket: 'Pendapatan untuk Penjualan Tiket ' + q.name,
              akun_debet: null,
              akun_kredit: q.nomor_akun_pendapatan,
              saldo: total,
              removable: 'false',
              periode_id: 0,
              createdAt: myDate,
              updatedAt: myDate,
            },
            {
              transaction: this.t,
            }
          );

        } else { // Jika pembayaran dilakukan secara full 
          // Insert Pendapatan Jurnal
          await Jurnal.create(
            {
              division_id: body.cabang, 
              source: 'ticketTransactionId:' + insert.id,
              ref: 'PendapatanPenjualan Tiket ' + q.name,
              ket: 'PendapatanPenjualan Tiket ' + q.name,
              akun_debet: body.paket ? '23000' : '11010',
              akun_kredit: q.nomor_akun_pendapatan,
              saldo: body.dibayar,
              removable: 'false',
              periode_id: 0,
              createdAt: myDate,
              updatedAt: myDate,
            },
            {
              transaction: this.t,
            }
          );
        }


      }

      // cabang
      // kostumer
      // paket
      // maskapai
      // pax
      // kode_booking
      // tanggal_keberangkatan
      // harga_travel
      // harga_kostumer
      // dibayar
      // Validate input
      // if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      //   return { status: 400, message: "No tickets provided." };
      // }

      // if (!body.nomor_register) {
      //   return { status: 400, message: "Nomor register is required." };
      // }
      // Calculate total transaction
      // let totalTransaksi = 0;
      // for (const ticket of tickets) {
      //   totalTransaksi += Number(ticket.pax) * Number(ticket.customer_price);
      // }
      // insert ke table Ticket_transactions
      // const tiketTransactions = await Ticket_transaction.create(
      //   {
      //     division_id: this.division_id,
      //     kostumer_id: customer.paket_id ? null : customer.kostumer_id,
      //     paket_id: customer.paket_id,
      //     nomor_register: body.nomor_register,
      //     total_transaksi: totalTransaksi,
      //     status: "active",
      //   },
      //   { transaction: this.t }
      // );

      // if (tiketTransactions)
      //   console.log("Inserted Ticket Transaction:", tiketTransactions.toJSON());

      // var listAirlinesId = [];
      // for( const tiket of tickets) {
      //   if (!listAirlinesId.includes(tiket.airlines_id)) {
      //     listAirlinesId.push(tiket.airlines_id); 
      //   }
      // }

      // var listAirLines = {};
      // await Mst_airline.findAll({
      //   attributes: ["id", "name",  "nomor_akun_deposit", "nomor_akun_pendapatan", "nomor_akun_hpp"],
      //   where: { company_id: this.company_id, id: {[Op.in] : listAirlinesId } },
      // }).then(async (value) => {
      //   await Promise.all(
      //     await value.map(async (e) => {
      //       listAirLines[e.id] = {
      //         name: e.name,
      //         nomor_akun_deposit: e.nomor_akun_deposit, 
      //         nomor_akun_pendapatan: e.nomor_akun_pendapatan,
      //         nomor_akun_hpp: e.nomor_akun_hpp,
      //       }
      //     })
      //   );
      // });

      // insert all tickets to tabel Ticket_transaction_details
      // for (const ticket of tickets) {
      //   try {
      //     const tiketTansactionDetail = await Ticket_transaction_detail.create(
      //       {
      //         ticket_transaction_id: tiketTransactions.id,
      //         pax: ticket.pax,
      //         code_booking: ticket.code_booking,
      //         departure_date: ticket.departure_date,
      //         costumer_price: ticket.customer_price,
      //         airlines_id: ticket.airlines_id,
      //         travel_price: ticket.travel_price,
      //       },
      //       { transaction: this.t }
      //     );

      //     // transaksi 1 Jurnal untuk HPP
      //     await Jurnal.create(
      //       {
      //         division_id: body.cabang, 
      //         source: 'ticketTransactionId:' + tiketTansactionDetail.id,
      //         ref: 'HPP Penjualan Tiket ' + listAirLines[ticket.airlines_id].name,
      //         ket: 'HPP Penjualan Tiket ' + listAirLines[ticket.airlines_id].name,
      //         akun_debet: listAirLines[ticket.airlines_id].nomor_akun_hpp,
      //         akun_kredit: listAirLines[ticket.airlines_id].nomor_akun_deposit,
      //         saldo: ticket.travel_price,
      //         removable: 'false',
      //         periode_id: 0,
      //         createdAt: myDate,
      //         updatedAt: myDate,
      //       },
      //       {
      //         transaction: this.t,
      //       }
      //     );

      //     // check apakah dibayar lunas atau tidak.

      //     // transaksi 2 Jurnal untuk Pendapatan
      //     await Jurnal.create(
      //       {
      //         division_id: body.cabang, 
      //         source: 'ticketTransactionId:' + tiketTansactionDetail.id,
      //         ref: 'PendapatanPenjualan Tiket ' + listAirLines[ticket.airlines_id].name,
      //         ket: 'PendapatanPenjualan Penjualan Tiket ' + listAirLines[ticket.airlines_id].name,
      //         akun_debet: customer.paket_id ? '23000' : '11010',
      //         akun_kredit: listAirLines[ticket.airlines_id].nomor_akun_pendapatan,
      //         saldo: ticket.customer_price,
      //         removable: 'false',
      //         periode_id: 0,
      //         createdAt: myDate,
      //         updatedAt: myDate,
      //       },
      //       {
      //         transaction: this.t,
      //       }
      //     );

      //   } catch (error) {
      //     throw new Error(`Failed to insert ticket detail: ${err.message}`);
      //   }
      // }
      // insert to table Ticket_payment_history if dibayar > 0
      // if (customer.dibayar > 0) {
      //   const ticketPaymentHistory = await Ticket_payment_history.create(
      //     {
      //       ticket_transaction_id: tiketTransactions.id,
      //       invoice: body.invoice,
      //       nominal: customer.dibayar,
      //       status: "cash",
      //       petugas: type,
      //     },
      //     { transaction: this.t }
      //   );
      // }



      // Commit the transaction
      await this.t.commit();
      // return {
      //   status: 200,
      //   message: "Transaksi Tiket Berhasil Dilakukan",
      //   data: tiketTransactions,
      // };
    } catch (error) {
      console.log("xxxx");
      console.log(error);
      console.log("xxxx");
      await this.t.rollback();
      return { status: 500, message: error.message };
    }
  }

  async invoice() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)];

    const randomNumbers = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0"); // pastiin selalu 6 digit

    return randomLetters + randomNumbers;
  }

  async add_pembayaran_tikects() {
    await this.initialize();
    const body = this.req.body;
    const type = await tipe(this.req);
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {

      const q = await Ticket_transaction.findOne({ 
          where: { 
              id: this.req.body.id 
          }, 
          include: [
              { 
              model: Division, 
              required: true, 
              where: { 
                  company_id: this.company_id 
              } 
              },
              { 
              model: Mst_airline, 
              required: true, 
              },
          ]
      });

      // generated invoice 
      const invoice = await generateNomorInvoicePembayaranTicket(q.division_id);
      // 
      await Ticket_payment_history.create(
        {
          ticket_transaction_id: this.req.body.id,
          invoice: invoice,
          nominal: body.dibayar,
          status: "cash",
          petugas: this.type,
        },
        { transaction: this.t }
      );

      // Insert Pendatapatan Maskapai 
      await Jurnal.create(
        {
          division_id: q.division_id, 
          source: 'ticketTransactionId:' + this.req.body.id,
          ref: 'Pembayaran utang untuk Penjualan Tiket ' + q.Mst_airline.name,
          ket: 'Pembayaran utang untuk Penjualan Tiket ' + q.Mst_airline.name,
          akun_debet: null,
          akun_kredit: '13000',
          saldo: this.req.body.dibayar,
          removable: 'false',
          periode_id: 0,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = "Pembayaran Tiker Berhasil ";
      return invoice;
    } catch (error) {

      console.log("_____________");
      console.log(error);
      console.log("_____________");
      this.state = false;
      return '';
    }
  }

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
