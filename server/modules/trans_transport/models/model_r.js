const {
  Transport_transaction,
  Transport_transaction_detail,
  Mst_mobil,
  sequelize,
} = require("../../../models");
const moment = require("moment");
const { Op, where } = require("sequelize");
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

  async daftar_transaksi_transport() {
    await this.initialize(); // inisialisasi this.company_id

    try {
      const list = await Transport_transaction.findAll({
        where: {
          company_id: this.company_id,
        },
        include: [
          {
            model: Transport_transaction_detail,
            attributes: ["car_number", "price"],
            include: [
              {
                model: Mst_mobil,
                attributes: ["name"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Format data biar rapi
      const hasil = list.map((trx) => {
        const details = trx.Transport_transaction_details || [];

        const total_price = details.reduce((acc, d) => acc + (d.price || 0), 0);

        const detail_mobil = details.map((d) => ({
          car_number: d.car_number || "-",
          price: d.price || 0,
          nama_mobil: d.Mst_mobil?.name || "-",
        }));

        return {
          id: trx.id,
          invoice: trx.invoice,
          payer: trx.payer,
          payer_identity: trx.payer_identity,
          petugas: trx.petugas,
          tanggal_transaksi: moment(trx.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          total_price,
          detail_mobil,
        };
      });

      return hasil;
    } catch (err) {
      console.error("❌ Gagal ambil data transaksi transport:", err);
      return [];
    }
  }

  async daftar_mobil() {
    await this.initialize();
    try {
      const sql = await Mst_mobil.findAll({
        where: {
          company_id: this.company_id,
        },
      });
      return sql.map((e) => {
        return {
          id: e.id,
          name: e.name,
        };
      });
    } catch (error) {
      return [];
      console.log(error);
    }
  }
}

module.exports = Model_r;
