const { Op, Fasilitas_paket_la, Detail_fasilitas_paket_la, Paket_la, Company, Division } = require("../../../models");
const { getCabang, getCompanyIdByCode } = require("../../../helper/companyHelper");
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
    console.log("==========================");
    console.log("Divisi ID: " + this.division_id);
    console.log("Company ID: " + this.company_id);
    console.log("==========================");
  }

  async getCompanyData() {
    const company = await Company.findOne({
      where: { id: this.company_id },
      attributes: ["company_name", "email", "whatsapp_company_number", "logo"],
    });
    const detail_company = await Division.findOne({
      where: { id: this.division_id },
      attributes: ["id", "pos_code", "address"],
    });

    return {
      id: this.company_id,
      logo: company?.logo,
      company_name: company?.company_name,
      email: company?.email,
      whatsapp_company_number: company?.whatsapp_company_number,
      detail_company: detail_company,
    };
  }

  async invoice_paket_la() {
    // initialize dependensi properties
    await this.initialize();

    const myDate = moment(new Date()).format("DD MMMM YYYY");
    const body = this.req.body;

    var where = {
      [Op.and]: [
        // { company_id: this.company_id },
        { division_id: this.division_id },
        { id: body.id },
      ],
    };

    console.log("==============================");
    console.log("WHERE:", where);
    console.log("Body:", body);
    console.log("==============================");
    
    var sql = {};
    sql["order"] = [["id", "ASC"]];
    sql["attributes"] = [
      "id",
      "division_id",
      "client_name",
      "client_hp_number",
      "client_address",
    ];
    sql["where"] = where;
    sql["include"] = [
      {
        model: Fasilitas_paket_la,
        where: {
          id: body.fasilitaspaketlaId,
        },
        attributes: [
          "id",
          "paket_la_id",
          "invoice",
          "total",
        ],
        include: [
          {
            model: Detail_fasilitas_paket_la,
            attributes: [
              "id",
              "fasilitas_paket_la_id",
              "description",
              "check_in",
              "check_out",
              "day",
              "pax",
              "price",
            ],
          },
        ],
      },
    ];

    try {
      const query = await dbList(sql);
      const q = await Paket_la.findAndCountAll(query.total);
      const total = q.count;
      let data = null;
    
      if (total > 0) {
        const values = await Paket_la.findAll(query.sql);
        const companyData = await this.getCompanyData();

        await Promise.all(
          values.map(async (e) => {
            const fasilitas_paket_la = e.Fasilitas_paket_las && e.Fasilitas_paket_las.length > 0 ? e.Fasilitas_paket_las[0] : null;
            const details = fasilitas_paket_la
              ? {
                  id: fasilitas_paket_la.id,
                  paket_la_id: fasilitas_paket_la.paket_la_id,
                  invoice: fasilitas_paket_la.invoice,
                  total: fasilitas_paket_la.total,
                  order_date: myDate,
                  detail_fasilitas: fasilitas_paket_la.Detail_fasilitas_paket_las.map((detail) => ({
                    id: detail.id,
                    fasilitas_paket_la_id: detail.fasilitas_paket_la_id,
                    description: detail.description,
                    check_in: detail.check_in ? moment(detail.check_in).format("YYYY-MM-DD") : null,
                    check_out: detail.check_out ? moment(detail.check_out).format("YYYY-MM-DD") : null,
                    day: detail.day,
                    pax: detail.pax,
                    price: detail.price,
                  })),
                }
              : null;
    
            data = ({
              id: e.id,
              division_id: e.division_id,
              client_name: e.client_name,
              client_hp_number: e.client_hp_number,
              client_address: e.client_address,
              companyData: companyData,
              fasilitas_paket_la: details,
            });
          })
        );
      }
    
      return {
        data: data,
        total: total,
      };
    } catch (error) {
      console.log("ERROR:", error);
      return {};
    }    
  }
}

module.exports = Model_r;
