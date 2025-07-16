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

  async daftar_transaksi_hotel() {
    try {
      await this.initialize();

      const body = this.req.body;
      const limit = body.perpage || 10;
      const page =
        body.pageNumber && body.pageNumber !== "0" ? body.pageNumber : 1;

      let where = { company_id: this.company_id };

      if (body.search) {
        where = {
          ...where,
          invoice: { [Op.like]: `%${body.search}%` },
        };
      }

      const sql = {
        limit: parseInt(limit),
        offset: (page - 1) * limit,
<<<<<<< HEAD
        order: [["updatedAt", "DESC"]],
        where: where,
=======
        order: [["id", "ASC"]],
        where,
>>>>>>> 5ce82c0f3c335113d8f61961e93e912a0881d9fc
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
        const listId = [];
        const paketIds = new Set();

        q.rows.forEach((trx) => {
          listId.push(trx.id);
          if (trx.paket_id) paketIds.add(trx.paket_id);

          data.push({
            id: trx.id,
            invoice: trx.invoice,
            petugas: trx.petugas,
            paket_id: trx.paket_id || null,
            kostumer_name: trx.Kostumer?.name || "-",
            tanggal_transaksi: moment(trx.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            total_harga: 0,
            details: [],
          });
        });

        const paketMap = await this.ambil_nama_paket_bulk([...paketIds]);

        data = data.map((trx) => ({
          ...trx,
          paket_name: trx.paket_id ? paketMap[trx.paket_id] || "-" : "-",
        }));

        const hotelDetails = await Hotel_transaction_detail.findAll({
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
        });

        const dataHotel = {};
        const totalHotel = {};

        hotelDetails.forEach((e) => {
          const trxId = e.hotel_transaction_id;
          if (!dataHotel[trxId]) dataHotel[trxId] = [];
          if (!totalHotel[trxId]) totalHotel[trxId] = 0;

          dataHotel[trxId].push({
            name: e.name,
            birth_place: e.birth_place,
            birth_date: e.birth_date,
            identity_number: e.identity_number,
            price: e.price,
            check_in: e.check_in,
            check_out: e.check_out,
            hotel_name: e.Mst_hotel?.name ?? "-",
          });

          totalHotel[trxId] += e.price;
        });

        data = data.map((trx) => ({
          ...trx,
          details: dataHotel[trx.id] || [],
          total_harga: totalHotel[trx.id] || 0,
        }));
      }

      return { data, total };
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
