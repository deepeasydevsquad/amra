const fs = require('fs');
const path = require('path');

const {
  Member,
  Deposit,
  Company,
  sequelize,
  Sequelize,
  Division,
} = require("../../../models");
const { Op } = require("sequelize");
const { getCompanyIdByCode, tipe, getCabang } = require("../../../helper/companyHelper");


class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
  }

  async header_kwitansi_invoice() {
    var data = {};
    await Division.findOne({
      attributes : ['name', 'city', "pos_code", 'address'],
      where: { id: this.company_id },
      include: [
        {
          required : true, 
          model: Company, 
          attributes: ['logo', "company_name", "email", "whatsapp_company_number", "invoice_logo", "invoice_title" ] 
        }
      ],
    }).then(async (e) => {
      if (e) {
        var exisFile = false;
        if( e.Company.invoice_logo !== null )  {
          const filePath = path.join(__dirname, 'uploads', e.Company.invoice_logo);
          if( fs.existsSync(filePath) ) {
            exisFile = true;
          }
        }
        data['logo'] = exisFile ? e.Company.invoice_logo : 'default.png';
        data['company_name'] = e.Company.company_name;
        data["city"] = e.city;
        data['address'] = e.address;
        data['pos_code'] = e.pos_code;
        data['email'] = e.email;
        data['whatsapp_company_number'] = e.Company.whatsapp_company_number;
      }
    });

    return data;
  }

  async dataInvoiceDeposit() {
    await this.initialize();
    
    try {
      
      var data = {...data,...await this.header_kwitansi_invoice() };

      await Deposit.findOne({
        where: { 
          company_id: this.company_id, 
          invoice: this.req.params.invoice
        }, 
        include : {
          required : true, 
          model : Member, 
          attributes : ['fullname']
        }
      }).then(async (e) => {
        if (e) {
            data["invoice"] = e.invoice;
            data["nominal"] = e.nominal;
            data["createdAt"] = e.createdAt;
            data['penerima'] = e.penerima;
            data['info'] = e.info;
            data['tipe_transaksi'] = e.tipe_transaksi;
            data['fullname'] = e.Member.fullname;
            data['saldo_sesudah'] = e.saldo_sesudah;
        }
      });

      return data;
    } catch (error) {
      return {}
    }
  }
}

module.exports = Model_r;
