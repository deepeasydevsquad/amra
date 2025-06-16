const {
  Op,
  Agen,
  Pembayaran_fee_agen,
  Member,
  Fee_agen,
  Level_keagenan,
} = require("../../../models");
const {
  getCompanyIdByCode,
  tipe,
  getCabang,
} = require("../../../helper/companyHelper");
const { convertToRP } = require("../../../helper/currencyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.type;
    this.division;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.type = await tipe(this.req);
    this.division = await getCabang(this.req);
  }

  async daftar_pembayaran_fee_agen() {
    await this.initialize();

    try {
      const sql = await Agen.findAll({
        include: [
          {
            required: true,
            model: Pembayaran_fee_agen,
            where: {
              company_id: this.company_id,
            },
            attributes: [
              "id",
              "invoice",
              "nominal",
              "applicant_name",
              "applicant_identity",
              "penerima",
            ],
          },
          {
            required: true,
            model: Member,
            attributes: ["fullname"],
          },
        ],
      });

      const data = await Promise.all(
        sql.flatMap((item) => {
          return item.Pembayaran_fee_agens.map(async (pembayaran) => ({
            id: item.id,
            name: item.fullname || (item.Member?.fullname ?? "-"),
            id_pembayaran: pembayaran.id || "-",
            invoice: pembayaran.invoice || "-",
            nominal: await convertToRP(pembayaran.nominal), // ✅ now works
            applicant_name: pembayaran.applicant_name || "-",
            applicant_identity: pembayaran.applicant_identity || "-",
            penerima: pembayaran.penerima || "-",
          }));
        })
      );

      return data;
    } catch (error) {
      console.error("Error daftar pembayaran fee agen:", error);
      throw error;
    }
  }

  async detail_fee_agen() {
    await this.initialize();
    const body = this.req.body;
    try {
      const sql = await Fee_agen.findAll({
        where: {
          pembayaran_fee_agen_id: body.id_pembayaran,
          company_id: this.company_id,
        },
        attributes: ["invoice", "nominal", "status_bayar", "info"],
      });

      if (!sql || sql.length === 0) return [];

      const data = await Promise.all(
        sql.map(async (item) => {
          return {
            invoice: item.invoice,
            nominal: await convertToRP(item.nominal),
            status_bayar: item.status_bayar,
            info: item.info,
          };
        })
      );
      return data;
    } catch (error) {
      console.error("Error di detail_fee_agen:", error);
      throw error;
    }
  }

  async daftar_agen() {
    await this.initialize();
    try {
      const sql = await Agen.findAll({
        attributes: ["id"],
        include: [
          {
            required: true,
            model: Member,
            where: {
              division_id: this.division,
            },
            attributes: ["fullname"],
          },
        ],
      });

      const data_agen = sql.map((item) => {
        return {
          id: item.id,
          name: item.Member.fullname,
        };
      });

      return data_agen;
    } catch (error) {
      console.error("Error di daftar_agen:", error);
      throw error;
    }
  }

  async fee_agen_by_id() {
    await this.initialize();
    const body = this.req.body;
    try {
      const sql = await Fee_agen.findAll({
        where: {
          agen_id: body.agen_id,
          company_id: this.company_id,
          status_bayar: "belum_lunas",
        },
      });

      if (!sql || sql.length === 0) return [];

      const data = await Promise.all(
        sql.map(async (item) => {
          return {
            id: item.id,
            nominal: await convertToRP(item.nominal),
            status: item.status,
            info: item.info,
          };
        })
      );

      return data;
    } catch (error) {
      console.error("Error di fee_agen_by_id:", error);
      throw error;
    }
  }
}

module.exports = Model_r;
