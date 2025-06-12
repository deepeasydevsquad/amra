const { Op, Ticket_transaction, Ticket_payment_history, Ticket_transaction_detail, Mst_airline  } = require("../../../models");
//const { tipe } = require("../../../helper/companyHelper");
//const { getCabang } = require("../../../helper/companyHelper");

class Model_r {
    constructor(req) {
      this.req = req;
      this.division_id;
    }
    async ticket_transactions() {

        const query = this.req.query;
        const limit = query.perpage || 10;
        const page =
            query.pageNumber && query.pageNumber !== "0" ? query.pageNumber : 1;
    
        let where = {};
    
        // Filter berdasarkan division_id jika ada
        if (query.division_id) {
            where.division_id = query.division_id;
        }
    
        // Filter berdasarkan pencarian (search)
        if (query.search) {
            where = {
            ...where,
            [Op.or]: [
                { nomor_register: { [Op.like]: `%${query.search}%` } },
                { status: { [Op.like]: `%${query.search}%` } },
            ],
            };
        }
        
        const sql = {
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [["updatedAt", "DESC"]],
            attributes: [
            "id",
            "division_id",
            "nomor_register",
            "total_transaksi",
            "status",
            "createdAt",
            "updatedAt",
            ],
            where: where,
            distinct: true,
            include: [
                {
                  model: Ticket_payment_history,
                 // as: "histories", // use your actual alias if defined
                  attributes: ["id","nominal", "invoice","ticket_transaction_id","costumer_name","costumer_identity","status","petugas","createdAt","updatedAt"], // adjust as needed
                },
                {
                  model: Ticket_transaction_detail,
                 // as: "details", // use your actual alias if defined
                  attributes: ["id", "pax","code_booking", "ticket_transaction_id","airlines_id", "departure_date","travel_price","costumer_price","createdAt","updatedAt"], // adjust as needed
                  include: [
                    {
                      model: Mst_airline,
                     // as: 'airline', // alias must match the one used in the association
                      attributes: ["id", "name"] // assuming "name" is the airline name field
                    }
                  ]
                },
            ],
        };
        
        try {
            const ticketTransaction = await Ticket_transaction.findAndCountAll(sql);
            const total = ticketTransaction.count;
            let data = [];
    
            if (total > 0) {
                // Ambil tipe dari token JWT
               // const type = await tipe(this.req);
        
                data = ticketTransaction.rows.map((transaction) => ({
                    id: transaction.id,
                    division_id : transaction.division_id, 
                    nomor_register: transaction.nomor_register,
                    total_transaksi: transaction.total_transaksi,
                    status: transaction.status,
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                    // Ticket detail info
                    ticket_details: transaction.Ticket_transaction_details?.map(detail => ({
                        id: detail.id,
                        pax: detail.pax,
                        code_booking: detail.code_booking,
                        ticket_transaction_id: detail.ticket_transaction_id,
                        airlines_id: detail.airlines_id,
                        airlines_name: detail.Mst_airline?.name ?? null,
                        departure_date: detail.departure_date,
                        travel_price: detail.travel_price,
                        costumer_price: detail.costumer_price,
                        createdAt: detail.createdAt,
                        updatedAt: detail.updatedAt,
                    })) ?? [],
                    // ALL payment history mapped
                    payment_histories: transaction.Ticket_payment_histories?.map(payment => ({
                        id: payment.id,
                        invoice: payment.invoice,
                        costumer_name: payment.costumer_name,
                        costumer_identity: payment.costumer_identity,
                        petugas: payment.petugas,
                        nominal: payment.nominal,
                        status: payment.status,
                        createdAt: payment.createdAt,
                        updatedAt: payment.updatedAt,
                    })) ?? [],
                }));
            }
    
            return {
                data: data,
                total: total,
                pageNumber: page,
                perpage: limit,
            };
        } catch (error) {
            console.error("ERROR: ticket_transactions()", error);
            return { data: [], total: 0, pageNumber: page, perpage: limit};
        }

    }
}
module.exports = Model_r;