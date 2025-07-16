const {
  Hotel_transaction,
  Hotel_transaction_detail,
  Mst_hotel,
  Mst_kota,
  Kostumer,
  Paket,
  sequelize,
  Company,
  Users,
  Member,
} = require("../../../models");
const moment = require("moment");
const { Op } = require("sequelize");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.division_id;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async daftar_transaksi_hotel() {
    try {
      await this.initialize(); // inisialisasi company_id

      const body = this.req.body;
      const limit = body.perpage || 10;
      const page =
        body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

      let where = { company_id: this.company_id };

      if (body.search) {
        where = {
          ...where,
          ...{
            invoice: { [Op.like]: `%${body.search}%` },
          },
        };
      }

      // Query utama dengan include Kostumer
      var sql = {
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        where: where,
        include: [
          {
            model: Kostumer,
            attributes: ["name"],
          },
        ],
      };

      const q = await Hotel_transaction.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        var listId = [];
        await Promise.all(
          await q.rows.map(async (trx) => {
            data.push({
              id: trx.id,
              invoice: trx.invoice,
              petugas: trx.petugas,
              // Tambahkan data kostumer dari relasi
              kostumer_name: trx.Kostumer?.name || "-",
              tanggal_transaksi: moment(trx.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              total_harga: 0,
              details: [],
            });
            listId.push(trx.id);
          })
        );

        var dataHotel = {};
        var totalHotel = {};

        // Query detail TANPA include Kostumer
        await Hotel_transaction_detail.findAll({
          where: {
            hotel_transaction_id: { [Op.in]: listId },
          },
          include: [
            {
              model: Mst_hotel,
              required: true,
              attributes: ["name"],
            },
          ],
        }).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              if (dataHotel[e.hotel_transaction_id] == undefined) {
                dataHotel = {
                  ...dataHotel,
                  ...{
                    [e.hotel_transaction_id]: [
                      {
                        name: e.name,
                        birth_place: e.birth_place,
                        birth_date: e.birth_date,
                        identity_number: e.identity_number,
                        price: e.price,
                        check_in: e.check_in,
                        check_out: e.check_out,
                        hotel_name: e.Mst_hotel?.name ?? "-",
                      },
                    ],
                  },
                };
                totalHotel = {
                  ...totalHotel,
                  ...{ [e.hotel_transaction_id]: e.price },
                };
              } else {
                dataHotel[e.hotel_transaction_id].push({
                  name: e.name,
                  birth_place: e.birth_place,
                  birth_date: e.birth_date,
                  identity_number: e.identity_number,
                  price: e.price,
                  check_in: e.check_in,
                  check_out: e.check_out,
                  hotel_name: e.Mst_hotel?.name ?? "-",
                });
                totalHotel[e.hotel_transaction_id] =
                  totalHotel[e.hotel_transaction_id] + e.price;
              }
            })
          );
        });

        for (let x in data) {
          if (dataHotel[data[x].id] !== undefined) {
            data[x].details = dataHotel[data[x].id];
            data[x].total_harga = totalHotel[data[x].id];
          }
        }
      }

      return { data: data, total: total };
    } catch (error) {
      console.error("Error in daftar_transaksi_hotel:", error);
      return {};
    }
  }

  async daftar_kota() {
    try {
      await this.initialize(); // inisialisasi company_id
      const sql = await Mst_kota.findAll({
        where: { company_id: this.company_id },
      });

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
        kode: d.kode,
      }));
      return data;
    } catch (error) {
      console.error("Gagal ambil daftar kota:", error);
      return [];
    }
  }

  async daftar_hotel() {
    try {
      await this.initialize(); // inisialisasi company_id
      const sql = await Mst_hotel.findAll({
        where: { company_id: this.company_id },
        include: [
          {
            model: Mst_kota,
            required: true,
            attributes: ["name"],
          },
        ],
      });

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
        kota: d.Mst_kotum.name,
      }));
      return data;
    } catch (error) {
      console.error("Gagal ambil daftar hotel:", error);
      return [];
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
