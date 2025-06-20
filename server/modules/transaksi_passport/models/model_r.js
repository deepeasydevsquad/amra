"use strict";

const {
  Op,
  Passport_transaction,
  Passport_transaction_detail,
  Mst_kota,
  Mst_visa_request_type,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");

class model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    if (!this.company_id) {
      this.company_id = await getCompanyIdByCode(this.req);
    }
  }

  async daftar_transaksi_passport() {
    await this.initialize();

    const body = this.req.body;
    var limit = body.perpage;
    var page = 1;

    if (body.pageNumber != undefined && body.pageNumber !== "0")
      page = body.pageNumber;

    var where = { company_id: this.company_id };

    if (body.search != undefined && body.search != "") {
      where = {
        ...where,
        ...{
          [Op.or]: [{ invoice: { [Op.like]: "%" + body.search + "%" } }],
        },
      };
    }

    console.log(
      "================ Get Daftar Transaksi Passport ================"
    );
    console.log(body);
    console.log(where);
    console.log(
      "================ Get Daftar Transaksi Passport ================"
    );

    var sql = {};
    sql["limit"] = limit * 1;
    sql["offset"] = (page - 1) * limit;
    sql["order"] = [["id", "ASC"]];
    sql["attributes"] = [
      "id",
      "invoice",
      "petugas",
      "payer",
      "payer_identity",
      "createdAt",
      "updatedAt",
    ];
    sql["where"] = where;
    sql["include"] = {
      required: true,
      model: Passport_transaction_detail,
      attributes: [
        "name",
        "identity_number",
        "birth_place",
        "birth_date",
        "kk_number",
        "address",
        "price",
      ],
    };

    try {
      const query = await dbList(sql);
      const q = await Passport_transaction.findAndCountAll(query.total);
      const total = await q.count;
      var data = [];
      if (total > 0) {
        await Passport_transaction.findAll(query.sql).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              data.push({
                id: e.id,
                invoice: e.invoice,
                petugas: e.petugas,
                payer: e.payer,
                payer_identity: e.payer_identity,
                createdAt: moment(e.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                name: e.Passport_transaction_details[0].name,
                identity_number:
                  e.Passport_transaction_details[0].identity_number,
                birth_place: e.Passport_transaction_details[0].birth_place,
                birth_date: e.Passport_transaction_details[0].birth_date,
                kk_number: e.Passport_transaction_details[0].kk_number,
                address: e.Passport_transaction_details[0].address,
                price: e.Passport_transaction_details[0].price,
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
      console.error("Error di daftar_transaksi_passport:", error);
      return {};
    }
  }

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
}

module.exports = model_r;
