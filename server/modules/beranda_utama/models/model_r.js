const {
  Op,
  Paket,
  Company,
  Paket_transaction,
  Jamaah,
  Member,
  Ticket_transaction_detail,
  Mst_pendidikan,
  Mst_pekerjaan,
  Mst_provider,
  Mst_asuransi,
  sequelize,
} = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const { getAlamatInfo } = require("../../../helper/alamatHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");
const ExcelJS = require('exceljs');

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

  async statusCard() {
    await this.initialize();
    const myDate = moment();

    try {
      const where = { division_id: this.division_id };
      const startOfMonth = myDate.clone().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = myDate.clone().endOf('month').format('YYYY-MM-DD');

      const [
        company,
        totalJamaah,
        paketBerangkat,
        totalTiketTerjual,
      ] = await Promise.all([
        Company.findOne({ where: { id: this.company_id }, attributes: ['saldo'] }),
        Jamaah.count({ where }),
        Paket.findAll({
          where: {
            ...where,
            departure_date: { [Op.gte]: myDate.format("YYYY-MM-DD") },
          },
          attributes: ['id'],
        }),
        Ticket_transaction_detail.count({
          where: {
            createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
          },
        }),
      ]);

      const paketIds = paketBerangkat.map(p => p.id);
      let totalJamaahBerangkat = 0;

      if (paketIds.length > 0) {
        const transaksi = await Paket_transaction.findAll({
          where: { 
            paket_id: { [Op.in]: paketIds },
            division_id: this.division_id, 
          },
          attributes: ['jamaah_id'],
          group: ['jamaah_id'],
        });
        totalJamaahBerangkat = transaksi.length;
      }

      return {
        saldo_perusahaan: company ? company.saldo : 0,
        total_jamaah_terdaftar: totalJamaah,
        total_paket_berangkat: paketIds.length,
        total_jamaah_berangkat: totalJamaahBerangkat,
        total_tiket_terjual: totalTiketTerjual,
      };
    } catch (error) {
      console.error("Error in statusCard:", error);
      return {
        saldo_perusahaan: 0,
        total_jamaah_terdaftar: 0,
        total_paket_berangkat: 0,
        total_jamaah_berangkat: 0,
        total_tiket_terjual: 0,
      };
    }
  }

  async daftarJamaah() {
    await this.initialize();

    const { perpage = 10, pageNumber = 1, search } = this.req.body || {};
    const limit = parseInt(perpage, 10);
    const page = parseInt(pageNumber, 10) > 0 ? parseInt(pageNumber, 10) : 1;
    const offset = (page - 1) * limit;

    const where = { division_id: this.division_id };

    if (search && search.trim() !== "") {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { '$Member.fullname$': { [Op.like]: searchTerm } },
        { '$Member.identity_number$': { [Op.like]: searchTerm } },
      ];
    }

    try {
      const { count, rows } = await Jamaah.findAndCountAll({
        where,
        include: [{
          model: Member,
          attributes: ['fullname', 'identity_number', 'birth_date', 'birth_place'],
        }],
        attributes: ['id', 'nomor_passport'],
        order: [['id', 'ASC']],
        limit,
        offset,
      });

      if (rows.length === 0) {
        return { data: [], total: 0 };
      }

      const jamaahIds = rows.map(item => item.id);

      const totalPembelian = await Paket_transaction.findAll({
        where: { jamaah_id: { [Op.in]: jamaahIds } },
        attributes: [
          'jamaah_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_pembelian'],
        ],
        group: ['jamaah_id'],
        raw: true,
      });

      const pembelianMap = totalPembelian.reduce((map, item) => {
        map[item.jamaah_id] = item.total_pembelian;
        return map;
      }, {});

      const data = rows.map(item => ({
        jamaah_name: item.Member?.fullname || '',
        jamaah_identity: item.Member?.identity_number || '',
        birth_date: item.Member?.birth_date ? moment(item.Member.birth_date).format('YYYY-MM-DD') : '',
        birth_place: item.Member?.birth_place || '',
        no_passport: item.nomor_passport || '',
        total: parseInt(pembelianMap[item.id] || 0, 10),
      }));

      return { data, total: count };
    } catch (error) {
      console.error("Error in daftarJamaah:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
