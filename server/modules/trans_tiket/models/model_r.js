const { Op, Ticket_transaction, Ticket_payment_history, Division, Mst_airline, Paket, Kostumer} = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const Akuntansi = require("../../../library/akuntansi");
const{ convertToRP } = require("../../../helper/currencyHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.division;
  }

  async initialize() {
    if (!this.company_id) {
      this.company_id = await getCompanyIdByCode(this.req);
      this.division = await getCabang(this.req);
    }
  }

  async get_airlines_by_id() {
    await this.initialize();
    const akuntansi = new Akuntansi(); 

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
          ]
      });
      
      var data = [{ id: "0", name: " -- Pilih Maskapai -- " }];
      await Mst_airline.findAll({
        attributes: ["id", "name", "nomor_akun_deposit"],
        where: { company_id: this.company_id },
        order: [["id", "ASC"]],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {

            console.log("******************");
            console.log(q.nomor_akun_deposit);
            console.log(q.division_id);
            console.log(this.company_id);
            console.log("******************");
            var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun(e.nomor_akun_deposit, this.company_id, q.division_id , '0') );
            data.push({ id: e.id, name: e.name + " (Saldo: " + saldo + ")"});
          })
        );
      });
      return data;
    } catch (error) {
      console.error("Error di Model_r saat mengambil getAllVisaTypes:", error);
      throw error;
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

  async get_info_pembayaran_tiket() {
    await this.initialize();
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
      const total = q.pax * q.costumer_price;
      var sudah_bayar = 0;
      await Ticket_payment_history.findAll({
        attributes: ["id", "nominal", "status"],
        where: { ticket_transaction_id: this.req.body.id },
        include: {
          model: Ticket_transaction, 
          required: true,
          where: { division_id: q.division_id }
        }
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            if( e.status == 'cash') {
              sudah_bayar = sudah_bayar + parseInt(e.nominal);
            }
          })
        );
      });
      return { nomor_registrasi: q.nomor_registrasi, kode_booking: q.code_booking, maskapai: q.Mst_airline.name, maskapai_id: q.Mst_airline.id, 
        pax: q.pax, harga: q.costumer_price, harga_travel: q.travel_price, tanggal_keberangkatan: moment(q.departure_date).format("YYYY-MM-DD"), total: total, sudah_bayar };
    } catch (error) {
      return { }
    }
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
        "nomor_registrasi",
        "status",
        "pax",
        "code_booking",
        "travel_price",
        "costumer_price",
        "departure_date",
        "createdAt",
        "updatedAt",
      ],
      where: where,
      distinct: true,
      include: [
        {
          model: Mst_airline,
          required: true, 
          attributes: ["id", "name"],
        },
        {
          model: Paket,
          attributes: ["id", "name"],
        },
        {
          model: Kostumer,
          attributes: ["id", "name"],
        },
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

            console.log("Paket Name--------------");
            console.log(paket_name);
            console.log("Paket Name--------------");

            return {
              id: transaction.id,
              division_id: transaction.division_id,
              nomor_registrasi: transaction.nomor_registrasi,
              total_transaksi: transaction.total_transaksi,
              status: transaction.status,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
              paket_name: transaction.Paket.name,
              costumer_name: transaction.Kostumer?.name ?? null,
              costumer_id: transaction.Kostumer?.id ?? null,
              travel_price: transaction.travel_price,
              costumer_price: transaction.costumer_price,
              pax: transaction.pax,
              code_booking: transaction.code_booking,
              airlines_name: transaction.Mst_airline.name,
              departure_date: moment(transaction.departure_date).format("YYYY-MM-DD"),
              createdAt: moment(transaction.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(transaction.updatedAt).format("YYYY-MM-DD HH:mm:ss") ,
              payment_histories:
                transaction.Ticket_payment_histories?.map((payment) => ({
                  id: payment.id,
                  invoice: payment.invoice,
                 
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
      console.log("XXXXXXX");
      console.log(error);
      console.log("XXXXXXX");
      // console.error("ERROR: ticket_transactions()", error);
      return { data: [], total: 0, pageNumber: page, perpage: limit };
    }
  }

  async getAirlines() {
    // Initialize company_id
    await this.initialize();
    const akuntansi = new Akuntansi(); 

    try {
      var data = [{ id: "0", name: " -- Pilih Maskapai -- " }];
      // 
      await Mst_airline.findAll({
        attributes: ["id", "name", "nomor_akun_deposit"],
        where: { company_id: this.company_id },
        order: [["id", "ASC"]],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun(e.nomor_akun_deposit, this.company_id, this.req.body.cabang, '0') );
            data.push({
              id: e.id,
              name: e.name + " (Saldo: " + saldo + ")",
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
