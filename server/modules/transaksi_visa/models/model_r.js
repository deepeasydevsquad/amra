'use strict';

const {
  Op,
  Visa_transaction,
  Visa_transaction_detail,
  Mst_kota,
  Mst_visa_request_type,
} = require("../../../models");
const{ getCompanyIdByCode } = require("../../../helper/companyHelper");
const{ dbList } = require("../../../helper/dbHelper");
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
          attributes: ['id', 'name'],
          order: [['name', 'ASC']],
          raw: true,
      });

      return visaTypes;
  } catch (error) {
      console.error("Error di Model_r saat mengambil getAllVisaTypes:", error);
      throw error;
  }
}

  // DAFTAR TRANSAKSI VISA
  async daftar_transaksi_visa() {
    await this.initialize();
  
    const body = this.req.body;
    var limit = body.perpage;
    var page = 1;
  
    if (body.pageNumber != undefined && body.pageNumber !== '0' ) page = body.pageNumber;
  
    var where = { company_id : this.company_id };
        
    if (body.search != undefined && body.search != "") {
      where = {...where,...{ 
        [Op.or]: [{ invoice : { [Op.like]: "%" + body.search + "%" }} ]
      }};
    }
  
    console.log("================ Get Daftar Transaksi Visa ================");
      console.log(body)
      console.log(where)
      console.log("================ Get Daftar Transaksi Visa ================");
  
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
    sql['include'] = {
      required : true,
      model : Visa_transaction_detail,
      attributes : [
        "name",
        "identity_number",
        "birth_place",
        "birth_date",
        "passport_number",
        "valid_until",
        "price",
        "mst_visa_request_type_id", 
      ]
    }
  
    try {
      const query = await dbList(sql);
      const q = await Visa_transaction.findAndCountAll(query.total);
      const total = await q.count;
      var data = [];
      if (total > 0) {
        await Visa_transaction.findAll(query.sql).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              let jenisVisa = "Visa Singgah";
              
              if (e.Visa_transaction_details[0].mst_visa_request_type_id) {
                try {
                  const visaType = await Mst_visa_request_type.findByPk(
                    e.Visa_transaction_details[0].mst_visa_request_type_id,
                    { attributes: ['name'] }
                  );
                  if (visaType) {
                    jenisVisa = visaType.name;
                  }
                } catch (error) {
                  console.error("Error fetching visa type:", error);
                }
              }
  
              data.push({
                id : e.id,
                invoice : e.invoice,
                petugas : e.petugas,
                payer : e.payer,
                payer_identity : e.payer_identity,
                createdAt : moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                name : e.Visa_transaction_details[0].name,
                identity_number : e.Visa_transaction_details[0].identity_number,
                birth_place : e.Visa_transaction_details[0].birth_place,
                birth_date : e.Visa_transaction_details[0].birth_date,
                passport_number : e.Visa_transaction_details[0].passport_number,
                valid_until : e.Visa_transaction_details[0].valid_until,
                price : e.Visa_transaction_details[0].price,
                jenis_visa: jenisVisa 
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
      console.error("Error di daftar_transaksi_visa:", error);
      return {};
    }
  }



  // MENGAMBIL DAFTAR KOTA
  async getAllCities() {
    await this.initialize(); 

    try {
        const cities = await Mst_kota.findAll({
            attributes: ['id', 'name', 'kode'],
            where: {
                company_id: this.company_id
            },
            order: [
                ['name', 'ASC']
            ],
            
            raw: true,
        });

        return cities;
    } catch (error) {
        console.error("Error di Model_r saat mengambil getAllCities:", error);
        throw error;
    }
  }
}

module.exports = Model_r;