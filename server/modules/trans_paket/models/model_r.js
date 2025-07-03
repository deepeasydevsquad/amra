const {
  Op,
  Paket,
  Paket_price,
  Company,
  Paket_transaction,
  Jamaah,
  Member,
  sequelize,
} = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const { getAlamatInfo } = require("../../../helper/alamatHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");
const ExcelJS = require('exceljs');
const fs = require('fs').promises; 
const path = require('path');

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null;
    this.division_id = null;
  }

  async initialize() {
    // Avoid re-initializing if already done
    if (this.company_id && this.division_id) {
      return;
    }
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
  }

  async getPaketList() {
    await this.initialize();

    try {
      const where = {
        division_id: this.division_id,  
        departure_date: {
          [Op.gte]: moment().startOf('day').toDate(),
        },
      };

      const dataPaket = await Paket.findAll({
        where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "name",
          "kode",
          "photo",
          "departure_date",
          "return_date",
        ],
        include: [
          {
            model: Paket_price,
            attributes: ["id", "price"],
          },
        ],
      });

      const dataJamaah = await Paket_transaction.count({
        where: {
          division_id: this.division_id,
          paket_id: {
            [Op.in]: dataPaket.map(p => p.id),
          },
        },
      });

      const data = await Promise.all(dataPaket.map(async paket => {
        const prices = paket.Paket_prices.map(item => item.price);
        const price = {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
        };
        const photoPath = paket.photo;
        let finalPhoto = photoPath;

        if (photoPath && photoPath !== '-') {
          const absolutePath = path.join(__dirname, '../../..', photoPath); 
          console.log("Checking file:", absolutePath);
          try {
            await fs.access(absolutePath, fs.constants.F_OK); 
          } catch (e) {
            finalPhoto = null;
          }
        } else {
          finalPhoto = null;
        }

        return {
          id: paket.id,
          name: paket.name,
          kode: paket.kode,
          photo: finalPhoto,
          durasi: moment(paket.return_date).diff(moment(paket.departure_date), 'days'),
          departure_date: moment(paket.departure_date).format("DD MMM YY"),
          prices: price,
          total_jamaah: dataJamaah,
        };
      }));

      return {
        data: data,
        total: data.length,
      };
    } catch (error) {
      console.error("Error in getPaketList:", error);
      throw new Error("Failed to retrieve paket list");
    }
  }
}

module.exports = Model_r;
