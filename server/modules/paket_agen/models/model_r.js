const {
  Op,
  Agen,
  Pembayaran_fee_agen,
  Member,
  Fee_agen,
  Level_keagenan,
  sequelize,
  Jamaah,
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

  async daftar_detail_agen() {
    await this.initialize();

    try {
      const sql = await Agen.findAll({
        include: [
          {
            model: Member,
            attributes: ["fullname", "whatsapp_number"],
          },
          {
            model: Level_keagenan,
            attributes: ["name"],
          },
          {
            model: Fee_agen,
            attributes: ["nominal", "status_bayar"],
          },
          {
            model: Jamaah,
            include: {
              model: Member,
              attributes: ["fullname", "identity_number"],
            },
          },
        ],
      });

      // Ekstrak & olah data
      const hasil = sql.map((agen) => {
        // Total fee berdasarkan status
        let total_belum_lunas = 0;
        let total_lunas = 0;

        agen.Fee_agens.forEach((fee) => {
          if (fee.status_bayar === "belum_lunas") {
            total_belum_lunas += Number(fee.nominal);
          } else if (fee.status_bayar === "lunas") {
            total_lunas += Number(fee.nominal);
          }
        });

        // Ambil data jamaah (yang di-rekrut oleh agen ini)
        const rekrutans = agen.Jamaahs.map((jamaah) => {
          return {
            id: jamaah.id,
            fullname: jamaah.Member?.fullname || null,
            identity_number: jamaah.Member?.identity_number || null,
          };
        });

        return {
          agen_id: agen.id,
          nama_agen: agen.Member?.fullname || null,
          whatsapp_number: agen.Member?.whatsapp_number || null,
          level_keagenan: agen.Level_keagenan?.name || null,
          total_belum_lunas,
          total_lunas,
          rekrutans,
        };
      });

      return hasil;
    } catch (error) {
      console.error("Gagal ambil data detail agen:", error);
      throw error;
    }
  }
}

module.exports = Model_r;
