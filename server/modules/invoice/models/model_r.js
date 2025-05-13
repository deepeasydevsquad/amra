const fs = require('fs');
const path = require('path');
const moment = require("moment");

const {
  Member,
  Deposit,
  Paket_la,
  Fasilitas_paket_la,
  Detail_fasilitas_paket_la,
  Paket_la_transaction,
  Company,
  sequelize,
  Sequelize,
  Division,
  Riwayat_tabungan
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
        data['email'] = e.Company.email;
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

  async dataInvoicePaketLa() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      var data = {...data,...await this.header_kwitansi_invoice() };

      const adaInvoice = await Fasilitas_paket_la.findOne({
        where: {
          invoice: this.req.params.invoice,
        },
      });

      if (!adaInvoice) {
        return {};
      }

      const sql = {
        attributes: ["client_name", "client_hp_number", "client_address"],
        where: {
          division_id: this.division_id,
        },
        include: {
            model: Fasilitas_paket_la,
            attributes: ["invoice", "total"],
            where: {
              invoice: this.req.params.invoice,
            },
            required: true, 
            include: [
              {
                model: Detail_fasilitas_paket_la,
                attributes: [
                  "description",
                  "check_in",
                  "check_out",
                  "createdAt",
                  "day",
                  "pax",
                  "price",
                ],
              },
            ],
          },
      };
  
      await Paket_la.findOne(sql).then(async (e) => {
        if (e) {
          data["client_name"] = e.client_name;
          data["client_hp_number"] = e.client_hp_number;
          data["client_address"] = e.client_address;
          data["order_date"] = myDate;
          data["invoice"] = e.Fasilitas_paket_las[0].invoice;
          data["total"] = e.Fasilitas_paket_las[0].total;
          data["detail_fasilitas"] = (e.Fasilitas_paket_las[0].Detail_fasilitas_paket_las || []).map(detail => ({
            description: detail.description,
            check_in: moment(detail.check_in).format("YYYY-MM-DD"),
            check_out: moment(detail.check_out).format("YYYY-MM-DD"),
            order_date: detail.createdAt,
            day: detail.day,
            pax: detail.pax,
            price: detail.price
          }))
        }
      })

      console.log(data)
    
      return data;
    } catch (error) {
      return {}
    }
  }

  async dataKwitansiTerakhir() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");
    
    try {
      var data = {...data,...await this.header_kwitansi_invoice() };

      const adaRegNum = await Paket_la.findOne({
        where: {
          register_number: this.req.params.register_number,
        },
      });

      if (!adaRegNum) {
        return {};
      }

      const sql = {
        attributes: ["register_number", "client_name", "client_hp_number", "client_address", "createdAt"],
        where: {
          division_id: this.division_id,
          register_number: this.req.params.register_number
        },
        include: {
            model: Paket_la_transaction,
            attributes: ["status", "invoice", "paid", "createdAt", "receiver"],
            required: true,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
      };
  
      await Paket_la.findOne(sql).then(async (e) => {
        if (e) {
          data["register_number"] = e.register_number;
          data["client_name"] = e.client_name;
          data["Transaksi"] = (e.Paket_la_transactions || []).map( transaction => ({
            status: transaction.status,
            invoice: transaction.invoice,
            receiver: transaction.receiver,
            paid: transaction.paid,
            date: moment(transaction.createdAt).format("YYYY-MM-DD HH:mm:ss")
          }));
        }
      })

      console.log(data)
    
      return data;
    } catch (error) {
      return {}
    }
  }

  async dataKwitansiTabunganUmrah() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");
    
    try {
      var data = {...data,...await this.header_kwitansi_invoice() };

      const adaRegNum = await Riwayat_tabungan.findOne({
        where: {
          invoice: this.req.params.invoice,
        },
      });

      if (!adaRegNum) {
        return {};
      }

      const sql = {
        attributes: ["invoice", "sumber_dana", "penerima", "info_tabungan", ""],
        where: {
          division_id: this.division_id,
          register_number: this.req.params.register_number
        },
        include: {
            model: Paket_la_transaction,
            attributes: ["status", "invoice", "paid", "createdAt", "receiver"],
            required: true,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
      };
  
      await Paket_la.findOne(sql).then(async (e) => {
        if (e) {
          data["register_number"] = e.register_number;
          data["client_name"] = e.client_name;
          data["Transaksi"] = (e.Paket_la_transactions || []).map( transaction => ({
            status: transaction.status,
            invoice: transaction.invoice,
            receiver: transaction.receiver,
            paid: transaction.paid,
            date: moment(transaction.createdAt).format("YYYY-MM-DD HH:mm:ss")
          }));
        }
      })

      console.log(data)
    
      return data;
    } catch (error) {
      return {}
    }
  }
}

module.exports = Model_r;
