const {
  Transaction_fasilitas,
  Transaction_fasilitas_detail,
  Mst_hotel,
  Mst_kota,
  Mst_fasilitas,
  Kostumer,
  Paket,
  sequelize,
  Tabungan,
  Item_fasilitas,
  Jamaah,
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

  async data_fasilita(ids) {
    const paketList = await Paket.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "facilities"],
    });
    

  }

  async daftar_transaksi_fasilitas() {
    try {
      await this.initialize();
      const body = this.req.body;
      const limit = parseInt(body.perpage) || 10;
      const page = body.pageNumber && body.pageNumber !== "0" ? parseInt(body.pageNumber) : 1;

      let where = { company_id: this.company_id };

      if (body.search) {
        where.invoice = { [Op.like]: `%${body.search}%` };
      }

      const sql = {
        limit,
        offset: (page - 1) * limit,
        order: [["updatedAt", "DESC"]],
        where,
        include: [
          {
            model: Kostumer,
            attributes: ["name"],
          },
          {
            model: Tabungan,
            required: false,
            attributes: ["id"],
            include: [
              {
                model: Jamaah,
                required: false,
                include: [
                  {
                    model: Member,
                    required: false,
                    attributes: ["fullname"],
                  },
                ],
              },
              {
                model: Paket,
                required: false,
                attributes: ["id", "name"],
              }
            ],
          },
          {
            model: Paket,
            attributes: ["id", "name"],
          },
        ],
      };

      const q = await Transaction_fasilitas.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        const listId = [];
        const paketIds = new Set();

        // Mapping transaksi dasar
        data = q.rows.map((trx) => {
          listId.push(trx.id);
          if (trx.paket_id) paketIds.add(trx.paket_id);

          return {
            id: trx.id,
            invoice: trx.invoice,
            petugas: trx.petugas,
            paket_id: trx.paket_id || null,
            kostumer_name: trx.Kostumer?.name || "-",
            tabungan_name: trx.Tabungan?.id || "-",
            tanggal_transaksi: moment(trx.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            total_harga: 0,
            details: [],
          };
        });

        // Mapping nama paket
        const paketMap = await this.ambil_nama_paket_bulk([...paketIds]);

        data = data.map((trx) => ({
          ...trx,
          paket_name: trx.paket_id ? paketMap[trx.paket_id] || "-" : "-",
        }));

        // Ambil detail fasilitas
        const detailList = await Transaction_fasilitas_detail.findAll({
          where: { transaction_fasilitas_id: { [Op.in]: listId } },
          include: [
            {
              model: Item_fasilitas,
              required: true,
              attributes: ["item_code", "status", "harga_beli", "harga_jual"],
              include: [
                {
                  model: Mst_fasilitas,
                  required: true,
                  attributes: ["name"],
                },
              ],
            },
          ],
        });

        // Susun data detail per transaksi
        const fasilitasMap = {};
        const totalHargaMap = {};

        detailList.forEach((e) => {
          const trxId = e.transaction_fasilitas_id;
          if (!fasilitasMap[trxId]) fasilitasMap[trxId] = [];
          if (!totalHargaMap[trxId]) totalHargaMap[trxId] = 0;

          const item = e.Item_fasilitas;
          const fasilitas = {
            item_code: item?.item_code || "-",
            status: item?.status || "-",
            harga_jual: item?.harga_jual || 0,
            harga_beli: item?.harga_beli || 0,
            fasilitas_name: item?.Mst_fasilitas?.name || "-",
          };

          fasilitasMap[trxId].push(fasilitas);
          totalHargaMap[trxId] += fasilitas.harga_jual || 0;
        });

        // Gabungkan kembali ke data utama
        data = data.map((trx) => ({
          ...trx,
          details: fasilitasMap[trx.id] || [],
          total_harga: totalHargaMap[trx.id] || 0,
        }));
      }

      return { data, total };
    } catch (error) {
      console.error("Error in daftar_transaksi_fasilitas:", error);
      return { data: [], total: 0 };
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
