"use strict";

const {
  Op,
  Visa_transaction,
  Visa_transaction_detail,
  Mst_kota,
  Mst_visa_request_type,
  Kostumer,
  Paket,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    if (!this.company_id) {
      this.company_id = await getCompanyIdByCode(this.req);
    }
  }

  //Mengambil semua data jenis visa yang tersedia untuk dropdown.
  async getAllVisaTypes() {
    await this.initialize();

    try {
      const visaTypes = await Mst_visa_request_type.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        raw: true,
      });

      return visaTypes;
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

  // DAFTAR TRANSAKSI VISA
  async daftar_transaksi_visa() {
    await this.initialize();

    try {
      const body = this.req.body;
      const limit = parseInt(body.perpage) || 10;
      const page =
        body.pageNumber && body.pageNumber !== "0"
          ? parseInt(body.pageNumber)
          : 1;

      let where = { company_id: this.company_id };

      if (body.search) {
        where = {
          ...where,
          invoice: { [Op.like]: `%${body.search}%` },
        };
      }

      const sql = {
        limit,
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
        where,
        include: [
          {
            model: Visa_transaction_detail,
            required: true,
            attributes: [
              "name",
              "identity_number",
              "birth_place",
              "birth_date",
              "passport_number",
              "valid_until",
              "price",
              "mst_visa_request_type_id",
            ],
          },
          {
            model: Kostumer,
            required: false,
            attributes: ["name"],
          },
        ],
      };

      const q = await Visa_transaction.findAndCountAll(sql);
      const total = q.count;
      let data = [];

      if (total > 0) {
        const paketIds = new Set();
        const trxList = q.rows;

        // collect paket_id untuk ambil nama paket
        trxList.forEach((trx) => {
          if (trx.paket_id) paketIds.add(trx.paket_id);
        });

        // ambil nama paket by ID
        const paketMap = await this.ambil_nama_paket_bulk([...paketIds]);

        await Promise.all(
          trxList.map(async (trx) => {
            let jenisVisa = "Visa Singgah";
            const detail = trx.Visa_transaction_details?.[0];

            if (detail?.mst_visa_request_type_id) {
              try {
                const visaType = await Mst_visa_request_type.findByPk(
                  detail.mst_visa_request_type_id,
                  { attributes: ["name"] }
                );
                if (visaType) jenisVisa = visaType.name;
              } catch (error) {
                console.error("Error fetching visa type:", error);
              }
            }

            data.push({
              id: trx.id,
              invoice: trx.invoice,
              petugas: trx.petugas,
              kostumer_name: trx.Kostumer?.name || "-",
              paket_id: trx.paket_id || null,
              paket_name: trx.paket_id ? paketMap[trx.paket_id] || "-" : "-",
              createdAt: moment(trx.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              name: detail?.name || "-",
              identity_number: detail?.identity_number || "-",
              birth_place: detail?.birth_place || "-",
              birth_date: detail?.birth_date || "-",
              passport_number: detail?.passport_number || "-",
              valid_until: detail?.valid_until || "-",
              price: detail?.price || 0,
              jenis_visa: jenisVisa,
            });
          })
        );
      }

      console.log("data:", data);
      console.log("total:", total);

      return {
        data,
        total,
      };
    } catch (error) {
      console.error("❌ Gagal ambil data transaksi visa:", error);
      return { data: [], total: 0 };
    }
  }

  // MENGAMBIL DAFTAR KOTA
  async getAllCities() {
    await this.initialize();

    try {
      const cities = await Mst_kota.findAll({
        attributes: ["id", "name", "kode"],
        where: {
          company_id: this.company_id,
        },
        order: [["name", "ASC"]],

        raw: true,
      });

      return cities;
    } catch (error) {
      console.error("Error di Model_r saat mengambil getAllCities:", error);
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
