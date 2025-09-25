const {
  Op,
  Request_member,
  Agen,
  Member,
  Company,
  Request_deposit_company,
} = require("../../../models");
const {
  getCompanyIdByCode,
  getCabang,
  tipe,
} = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.tipe;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async list() {
    await this.initialize();
    const body = this.req.body;
    var limit = body.perpage;
    var page = 1;

    if (body.pageNumber != undefined && body.pageNumber !== "0")
      page = body.pageNumber;

    let where = { company_id: this.company_id };

    if (body.search != undefined && body.search != "") {
      where = {
        ...where,
        ...{
          [Op.or]: [{ request_code: { [Op.like]: "%" + body.search + "%" } }],
        },
      };
    }

    var sql = {};
    sql["limit"] = limit * 1;
    sql["offset"] = (page - 1) * limit;
    sql["order"] = [["id", "ASC"]];
    sql["attributes"] = [
      "id",
      "request_code",
      "bank",
      "number_account_bank",
      "name_account_bank",
      "nominal",
      "nominal_code",
      "sending_payment_status",
      "sending_payment_time",
      "status",
      "status_node",
      "petugas",
      "updatedAt",
    ];
    sql["where"] = where;

    try {
      const query = await dbList(sql);
      const q = await Request_deposit_company.findAndCountAll(query.total);
      const total = await q.count;
      var data = [];
      if (total > 0) {
        await Request_deposit_company.findAll(query.sql).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              data.push({
                id: e.id,
                request_code: e.request_code,
                bank: e.bank,
                number_account_bank: e.number_account_bank,
                name_account_bank: e.name_account_bank,
                nominal: e.nominal,
                nominal_code: e.nominal_code,
                sending_payment_status: e.sending_payment_status,
                status: e.status,
                status_node: e.status_node,
                petugas: e.petugas,
                sending_payment_time:
                  e.sending_payment_time == null
                    ? "-"
                    : moment(e.sending_payment_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                      ),
                updatedAt: moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
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
      console.log("------XXXXX`1111111111111-----");
      console.log(error);
      console.log("------XXXXX`1111111111111-----");
      return {};
    }
  }
}

module.exports = Model_r;
