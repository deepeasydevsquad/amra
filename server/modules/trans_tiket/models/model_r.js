const { Op, Ticket_transaction, Ticket_payment_history, Ticket_transaction_detail, Mst_airline  } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");

class Model_r {
    constructor(req) {
      this.req = req;
      this.division_id;
    }

    async initialize() {
        if (!this.company_id) {
            this.company_id = await getCompanyIdByCode(this.req);
        }
    }

    async ticket_transactions() {

        const query = this.req.query;
        const limit = query.perpage || 10;
        const page = query.pageNumber && query.pageNumber !== "0" ? query.pageNumber : 1;
    
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
                  attributes: ["id","nominal", "invoice","ticket_transaction_id","costumer_name","costumer_identity","status","petugas","createdAt","updatedAt"],
                },
                {
                  model: Ticket_transaction_detail,
                  attributes: ["id", "pax","code_booking", "ticket_transaction_id","airlines_id", "departure_date","travel_price","costumer_price","createdAt","updatedAt"],
                  include: [
                    {
                      model: Mst_airline,
                       attributes: ["id", "name"]
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

    async getAirlines() {
        // Initialize company_id
        await this.initialize();

        try {
            var data = [{id: "0", name: "Pilih Maskapai"}];
            await Mst_airline.findAll({ 
                attributes: ['id', 'name'], 
                where: { company_id : this.company_id}, 
                order: [['id', 'ASC']], 
            }).then(async (value) => {
                await Promise.all(
                    await value.map(async (e) => {
                        data.push({ 
                            id : e.id, 
                            name : e.name
                        });
                    })
                );
            });
            return data;
        } catch (error) {
            console.error("Error di Model_r saat mengambil getAllVisaTypes:", error);
            throw error;
        }

    }

}
module.exports = Model_r;