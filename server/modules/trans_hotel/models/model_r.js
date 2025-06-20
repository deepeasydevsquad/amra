const {
  Hotel_transaction,
  Hotel_transaction_detail,
  Mst_hotel,
  Mst_kota,
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

      const transaksiList = await Hotel_transaction.findAll({
        where: { company_id: this.company_id },
        include: [
          {
            model: Hotel_transaction_detail,
            required: true,
            attributes: [
              "name",
              "birth_date",
              "birth_place",
              "identity_number",
              "price",
              "check_in",
              "check_out",
            ],
            include: [
              {
                model: Mst_hotel,
                required: true,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      const data = transaksiList.map((trx) => {
        const detailList = trx.Hotel_transaction_details || []; // ⬅️ fix di sini

        const total_harga = detailList.reduce(
          (sum, detail) => sum + Number(detail.price || 0),
          0
        );

        return {
          id: trx.id,
          invoice: trx.invoice,
          payer: trx.payer,
          payer_identity: trx.payer_identity,
          petugas: trx.petugas,
          tanggal_transaksi: moment(trx.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          total_harga: total_harga,
          details: detailList.map((d) => ({
            name: d.name,
            birth_place: d.birth_place,
            birth_date: d.birth_date,
            identity_number: d.identity_number,
            price: d.price,
            check_in: d.check_in,
            check_out: d.check_out,
            hotel_name: d.Mst_hotel?.name ?? "-",
          })),
        };
      });

      return data;
    } catch (error) {
      console.error("Gagal ambil daftar transaksi hotel:", error);
      return [];
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
}

module.exports = Model_r;
