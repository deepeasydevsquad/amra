const { 
    sequelize,
    Ticket_transaction,
    Ticket_transaction_detail,
    Ticket_payment_history,
   } = require("../../../models");
const { getCabang } = require("../../../helper/companyHelper");
const { tipe } = require("../../../helper/companyHelper");

//const Model_r = require("../models/model_r");

class Model_cud {
    constructor(req) {
      this.req = req;
      this.division_id;
    }
    async initialize() {
        this.t = await sequelize.transaction();
        this.division_id = await getCabang(this.req);
        this.state = true;
    }
    // === GENERATE UNIQUE NOMOR INVOICE
    async generateNomorInvoice() {
        try {
           const nomorInvoice = await Ticket_payment_history.generateUniqueNomorInvoice();
           return { status : 200, message : "Nomor Invoice Berhasil Digenerate", data : {invoice: nomorInvoice}};
         } catch (error) {
           return { status : 200, message : "Nomor Invoice Gagal digenerate", data : {}};
           
       }
    }
    // === GENERATE UNIQUE NOMOR REGISTER
    async generateNomorRegister() {
         try {
            const nomorRegister = await Ticket_transaction.generateUniqueNomorRegister();
            return { status : 200, message : "Nomor Register Berhasil Digenerate", data : {nomor_register: nomorRegister}};
           // res.status(200).json({ nomor_register: nomorRegister });
          } catch (error) {
            return { status : 200, message : "Nomor Register Gagal digenerate", data : {}};
            //res.status(500).json({ message: 'Failed to generate nomor_register', error: error.message });
        }
    }
    // === CREATE ===
    async add() {
        await this.initialize();
        const body = this.req.body;
        const tickets = JSON.parse(body.tickets);
        const customer = JSON.parse(body.customer);
        const type = await tipe(this.req);

        try {
            // Validate input
            if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
                return { status: 400, message: 'No tickets provided.' };
            }

            if (!body.nomor_register) {
                return { status: 400, message: 'Nomor register is required.' };
            }
            // Calculate total transaction
            let totalTransaksi = 0;
            for (const ticket of tickets) {
                totalTransaksi += Number(ticket.pax) * Number(ticket.customer_price);
            }
            // insert ke table Ticket_transactions
            const tiketTransactions = await Ticket_transaction.create({
                division_id: this.division_id,
                nomor_register: body.nomor_register,
                total_transaksi: totalTransaksi,
                status: 'active',

            }, {transaction: this.t});

            if(tiketTransactions)
                console.log('Inserted Ticket Transaction:', tiketTransactions.toJSON());

            // insert all tickets to tabel Ticket_transaction_details
            for (const ticket of tickets) {
                try {
                    const tiketTansactionDetail = await Ticket_transaction_detail.create({
                        ticket_transaction_id : tiketTransactions.id,
                        pax : ticket.pax,
                        code_booking : ticket.code_booking,
                        departure_date : ticket.departure_date,
                        costumer_price : ticket.customer_price,
                        airlines_id : ticket.airlines_id,
                        travel_price : ticket.travel_price,
                    }, { transaction: this.t });
                }
                catch(error) {
                    throw new Error(`Failed to insert ticket detail: ${err.message}`);
                }
                
            }
            // insert to table Ticket_payment_history if dibayar > 0
            if(customer.dibayar > 0) {
                const ticketPaymentHistory = await Ticket_payment_history.create({
                    ticket_transaction_id : tiketTransactions.id,
                    invoice : body.invoice,
                    nominal : customer.dibayar,
                    costumer_name : customer.costumer_name,
                    costumer_identity : customer.costumer_identity,
                    status : 'cash',
                    petugas : type,

                }, { transaction: this.t });
            }
            // Commit the transaction
            await this.t.commit();
            return { status : 200, message : "Transaksi Tiket Berhasil Dilakukan", data : tiketTransactions};
        }
        catch(error) {
            await this.t.rollback();
            return {status : 500, message : error.message};
        }
        
    }
}
module.exports = Model_cud;