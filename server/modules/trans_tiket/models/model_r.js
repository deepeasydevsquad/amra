const {
  Op,
  Ticket_transaction,
  Ticket_payment_history,
  Ticket_transaction_detail,
  Mst_airline,
  Paket,
  Kostumer,
} = require("../../../models");
const {
  getCompanyIdByCode,
  getCabang,
} = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.division_id;
  }

  async initialize() {
    if (!this.company_id) {
      this.company_id = await getCompanyIdByCode(this.req);
      this.division = await getCabang(this.req);
    }
  }

  async ambil_nama_paket_bulk(ids) {
    const paketList = await Paket.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "name"],
    });

    const paketMap = {};
    paketList.forEach((paket) => {
      paketMap[paket.id] = paket.name;
    });

    return paketMap;
  }

  async ticket_transactions() {
    const query = this.req.query;
    const limit = parseInt(query.perpage) || 10;
    const page =
      query.pageNumber && query.pageNumber !== "0"
        ? parseInt(query.pageNumber)
        : 1;

    let where = {};

    if (query.division_id) {
      where.division_id = query.division_id;
    }

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
      limit,
      offset: (page - 1) * limit,
      order: [["updatedAt", "DESC"]],
      attributes: [
        "id",
        "division_id",
        "paket_id", // <== tambahin ini
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
          attributes: [
            "id",
            "nominal",
            "invoice",
            "ticket_transaction_id",
            "status",
            "petugas",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: Kostumer,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Ticket_transaction_detail,
          attributes: [
            "id",
            "pax",
            "code_booking",
            "ticket_transaction_id",
            "airlines_id",
            "departure_date",
            "travel_price",
            "costumer_price",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: Mst_airline,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    };

    try {
      const ticketTransaction = await Ticket_transaction.findAndCountAll(sql);
      const total = ticketTransaction.count;
      let data = [];

      if (total > 0) {
        data = await Promise.all(
          ticketTransaction.rows.map(async (transaction) => {
            // Ambil nama paket manual
            let paket_name = null;
            if (transaction.paket_id) {
              const paket = await Paket.findOne({
                where: { id: transaction.paket_id },
              });
              paket_name = paket?.name ?? null;
            }

            return {
              id: transaction.id,
              division_id: transaction.division_id,
              nomor_register: transaction.nomor_register,
              total_transaksi: transaction.total_transaksi,
              status: transaction.status,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
              paket_name, // <== ini dia bro
              ticket_details:
                transaction.Ticket_transaction_details?.map((detail) => ({
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
              payment_histories:
                transaction.Ticket_payment_histories?.map((payment) => ({
                  id: payment.id,
                  invoice: payment.invoice,
                  costumer_name: payment.Kostumer?.name ?? null,
                  costumer_id: payment.Kostumer?.id ?? null,
                  petugas: payment.petugas,
                  nominal: payment.nominal,
                  status: payment.status,
                  createdAt: payment.createdAt,
                  updatedAt: payment.updatedAt,
                })) ?? [],
            };
          })
        );
      }

      return {
        data: data,
        total: total,
        pageNumber: page,
        perpage: limit,
      };
    } catch (error) {
      console.error("ERROR: ticket_transactions()", error);
      return { data: [], total: 0, pageNumber: page, perpage: limit };
    }
  }

  async getAirlines() {
    // Initialize company_id
    await this.initialize();

    try {
      var data = [{ id: "0", name: "Pilih Maskapai" }];
      await Mst_airline.findAll({
        attributes: ["id", "name"],
        where: { company_id: this.company_id },
        order: [["id", "ASC"]],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            data.push({
              id: e.id,
              name: e.name,
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

  async get_detail_tiket() {
    await this.initialize();
    const body = this.req.body;

    const division_id = this.division_id;
    console.log("division_id:", division_id);

    try {
      const sql = await Ticket_transaction.findOne({
        where: {
          nomor_register: body.nomor_register,
          // division_id: division_id, // Uncomment kalo emang perlu filter divisi
        },
        attributes: ["nomor_register"],
        include: [
          {
            model: Ticket_payment_history,
            attributes: [
              "invoice",
              "nominal",
              "petugas",
              "status",
              "createdAt",
              "kostumer_id", // pastiin field ini ada di payment_history
            ],
            include: [
              {
                model: Kostumer,
                attributes: ["name"],
                required: false, // biar gak error kalo gak ada relasi
              },
            ],
          },
        ],
      });

      if (!sql) return null;

      const data = {
        nomor_register: sql.nomor_register,
        riwayat_pembayaran: sql.Ticket_payment_histories.map((item) => ({
          invoice: item.invoice,
          customer_name: item.Kostumer?.name || "-", // amanin null relasi
          petugas: item.petugas,
          nominal: item.nominal,
          status: item.status,
          tanggal_transaksi: moment(item.createdAt).format(
            "D MMMM YYYY, HH:mm"
          ),
        })),
      };

      return data;
    } catch (error) {
      console.error("❌ Error get_detail_tiket:", error);
      throw error;
    }
  }

  async daftar_kostumer() {
    try {
      await this.initialize(); // inisialisasi company_id
      const sql = await Kostumer.findAll({
        where: { company_id: this.company_id },
      });

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
      }));
      return data;
    } catch (error) {
      console.error("Gagal ambil daftar kostumer:", error);
      return [];
    }
  }

  async daftar_paket() {
    const body = this.req.body;
    try {
      const sql = await Paket.findAll({
        where: { division_id: body.division_id },
      });

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
      }));

      return data;
    } catch (error) {
      console.error("Gagal ambil daftar kostumer:", error);
      return [];
    }
  }
}
module.exports = Model_r;
