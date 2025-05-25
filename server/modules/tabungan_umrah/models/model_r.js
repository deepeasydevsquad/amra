const {
  Op,
  Paket,
  Paket_price,
  Tabungan,
  Jamaah,
  Riwayat_tabungan,
  Agen,
  Level_keagenan,
  Fee_agen,
  Member,
  Deposit,
  Jurnal,
} = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const { getAgenById } = require("../../../helper/JamaahHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");
  
class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
  }

  async daftar_tabungan_umrah() {
    // initialize dependensi properties
    await this.initialize();

    const body = this.req.body;
    const pageNumber = parseInt(body.pageNumber) || 1;
    const perpage = parseInt(body.perpage) || 10;
    const offset = (pageNumber - 1) * perpage;
    const search = body.search || "";
    const filter = body.filter || "belum_beli_paket";

    var where = { division_id: this.division_id };
    
    if (filter === "belum_beli_paket") {
      where = {
        ...where,
        paket_transaction_id: null,
        batal_berangkat: "tidak",
      };
    } else if (filter === "sudah_beli_paket") {
      where = {
        ...where,
        paket_transaction_id: {[Op.not]: null},
        batal_berangkat: "tidak",
      };
    } else if (filter === "batal_berangkat") {
      where = {
        ...where,
        batal_berangkat: "ya",
      };
    }

    const searchJamaahIds = async (searchTerm) => {
      const jamaahIds = await Jamaah.findAll({
        attributes: ['id'],
        where: {
          [Op.or]: [
            { '$Member.fullname$': { [Op.like]: `%${searchTerm}%` } },
            { '$Member.identity_number$': { [Op.like]: `%${searchTerm}%` } },
          ],
        },
        include: [
          {
            model: Member,
          },
        ],
        raw: true,
      }).then((res) => res.map((r) => r.id));

      return jamaahIds;
    };

    if (search) {
      const jamaahIds = await searchJamaahIds(search);
      where = {
        ...where,
        jamaah_id: { [Op.in]: jamaahIds },
      };
    }

    var sql = {};
    sql["order"] = [["id", "ASC"]];
    sql["attributes"] = [
      "id",
      "target_paket_id",
      "total_tabungan",
      "status",
      "fee_agen_id",
      "batal_berangkat",
      "paket_transaction_id",
      "sisa_pembelian",
      "invoice_sisa_deposit",
      "createdAt",
      "updatedAt"
    ];
    sql["include"] = [
      {
        model: Jamaah,
        required: true,
        include: [
          {
            model: Member,
            attributes: [
              "fullname",
              "identity_number",
              "birth_place",
              "birth_date",
            ],
            required: false
          },
        ]
      }
    ];
    sql["where"] = where;
    sql["limit"] = perpage;
    sql["offset"] = offset;

    try {
      const query = await dbList(sql);
      const q = await Tabungan.findAndCountAll(query.total);
      const total = await q.count;
      
      var data = [];
      if (total > 0) {
        await Tabungan.findAll(query.sql).then(async (value) => {
          await Promise.all(
            value.map(async (e) => {
              data.push({
                id: e.id,
                member: e.Jamaah?.Member
                  ? {
                      fullname: e.Jamaah.Member.fullname,
                      identity_number: e.Jamaah.Member.identity_number,
                      birth_place: e.Jamaah.Member.birth_place,
                      birth_date: moment(e.Jamaah.Member.birth_date).format('DD MMMM YYYY'),
                    }
                  : { fullname: "-", identity_number: "-", birth_place: "-", birth_date: "-" },
                target_paket_name: (await Paket.findOne({ where: { id: e.target_paket_id }, attributes: ["name"] }))?.name || "-",
                target_paket_id: e.target_paket_id || null,
                total_tabungan: e.total_tabungan,
                status: e.status,
                fee_agen_id: e.fee_agen_id || "-",
                agen: e.fee_agen_id
                  ? {
                      fullname: (await getAgenById(e.fee_agen_id))?.Member?.fullname || "-",
                      level: (await getAgenById(e.fee_agen_id))?.Level_keagenan?.name || "-",
                      default_fee: (await getAgenById(e.fee_agen_id))?.Level_keagenan?.default_fee || "-",
                    }
                  : { fullname: "-", level: "-" },
                batal_berangkat: e.batal_berangkat === "ya" ? true : false,
                paket_transaction_id: e.paket_transaction_id,
                sisa_pembelian: e.sisa_pembelian,
                invoice_sisa_deposit: e.invoice_sisa_deposit,
                riwayat_tabungan: await Promise.all(
                  (await Riwayat_tabungan.findAll({
                    where: {
                      tabungan_id: e.id,
                    },
                    order: [["id", "ASC"]], // Ambil riwayat tabungan terakhir (jika banyak)
                  })).map(async (riwayat) => ({
                    id: riwayat.id,
                    invoice: riwayat.invoice,
                    nominal_tabungan: riwayat.nominal_tabungan,
                    transaksi: moment(riwayat.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    penerima: riwayat.penerima
                  }))
                ),          
                createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
              });
            })
          );          
        });
      }

      return {
        data: data,
        total: total,
      };

    } catch (error) {
      console.error("Error in daftar_tabungan_umrah:", error);
      return {};
    }
  }

  async getJamaahTabunganUmrah () {
    try {
      await this.initialize();

      const jamaah = await Jamaah.findAll({
        where: {
          division_id: this.division_id,
        },
        attributes: ["id", "agen_id"],
        include: [{
          model: Member,
          attributes: ["fullname"],
        }],
      });

      return {
        data: jamaah.map(e => ({
          id: e.id,
          agen_id: e.agen_id,
          name: e.Member.fullname
        })),
        total: jamaah.length,
      };

    } catch (error) {
      console.error("Error in getJamaahTabunganUmrah:", error);
      return {};
    }
  }
  async getPaketTabunganUmrah () {
    try {
      await this.initialize();
      var data = {};
      const paket = await Paket.findAll({
        where: {
          division_id: this.division_id,
          departure_date: {
            [Op.gte]: moment().format('YYYY-MM-DD'),
          },
        },
        attributes: ["id", "name", "departure_date"],
      });

      const paketPrices = await Paket_price.findAll({
        where: {
          paket_id: {
            [Op.in]: paket.map(e => e.id),
          },
        },
        attributes: ["paket_id", "price"],
      });

      if (paket) {
        data["data"] = paket.map(e => {
          const hargaSemua = paketPrices
            .filter(p => p.paket_id === e.id)
            .reduce((total, current) => total + Number(current.price), 0)

          return {
            id: e.id,
            name: e.name,
            price: hargaSemua,
            hari_tersisa: moment(e.departure_date).diff(moment(), 'days'),
          }
        });
      }

      return data;

    } catch (error) {
      console.error("Error in getPaketTabunganUmrah:", error);
      return {};
    }
  }

  async getAgenById () {
    try {
      await this.initialize();
      const body = this.req.body;
      console.log(body);
      var data = {};
      const agen = await Agen.findOne({
        where: {
          id: body.id,
        },
        attributes: ["id"],
        include: [
          {
            model: Member,
            attributes: ["fullname"],
          },
          {
            model: Level_keagenan,
            attributes: ["default_fee"],
          }
        ],
      });

      if (agen) {
        data["data"] = {
          id: agen.id,
          name: agen.Member.fullname,
          default_fee: Number(agen.Level_keagenan.default_fee)
        };
      }

      return data;

    } catch (error) {
      console.error("Error in getAgenById:", error);
      return {};
    }
  }
  async infoTabungan(id) {
    try {
      const tabungan = await Tabungan.findOne({
        where: { id: id },
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "total_tabungan",
          "jamaah_id",
          "status",
          "fee_agen_id",
          "paket_transaction_id",
          "batal_berangkat",
          "sisa_pembelian",
          "invoice_sisa_deposit",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Jamaah,
            required: true,
            include: [
              {
                model: Member,
                attributes: [
                  "id",
                  "fullname",
                  "identity_number",
                  "birth_place",
                  "birth_date",
                ],
                required: false,
              },
            ],
          },
        ],
      });

      if (!tabungan) return {};

      const data = {
        id: tabungan.id,
        status: tabungan.status,
        total_tabungan: tabungan.total_tabungan,
        jamaah_id: tabungan.jamaah_id,
        fee_agen_id: tabungan.fee_agen_id,
        batal_berangkat: tabungan.batal_berangkat,
        paket_transaction_id: tabungan.paket_transaction_id,
        sisa_pembelian: tabungan.sisa_pembelian,
        invoice_sisa_deposit: tabungan.invoice_sisa_deposit,
        createdAt: tabungan.createdAt,
        updatedAt: tabungan.updatedAt,
      };

      if (tabungan.Jamaah && tabungan.Jamaah.Member) {
        const member = tabungan.Jamaah.Member;
        data.jamaah = {
          id: member.id,
          fullname: member.fullname,
          identity_number: member.identity_number,
          birth_place: member.birth_place,
          birth_date: member.birth_date,
        };
      }

      return data;
    } catch (error) {
      console.error("Error in infoTabungan:", error);
      return {};
    }
  }
}

module.exports = Model_r;
