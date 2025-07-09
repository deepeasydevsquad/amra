"use strict";
const { sequelize, Kamar, Kamar_jamaah } = require("../../../models");
// const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const { menghasilkan_invoice_kas_keluar_masuk } = require("../../../helper/randomHelper");
const moment = require("moment");

const Model_r_cabang = require("../../param_cabang/models/model_r");

class model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  // async initialize() {
  //   if (!this.company_id) {
  //     this.company_id = await getCompanyIdByCode(this.req);
  //   }
  // }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // Tambah Akun
  async add_kas_keluar_masuk() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    const model = new Model_r_cabang(this.req);
    // await model.add_kas_keluar_masuk();
    const listDivision = await model.paramListAllCabang();

    try {

      const division_id = body.cabang;
      const invoice = await menghasilkan_invoice_kas_keluar_masuk(listDivision);
      const dibayar_diterima = body.diterima_dibayar;
      const ref = body.ref;
      const keterangan = body.keterangan;
      // var status_kwitansi = 'masuk';
      const kaskeluarmasuk = body.kaskeluarmasuk;
      var data = [];
      for( let x in kaskeluarmasuk ) {

        // const result = str.substring(0, 5);

      }

      // if (substr($akun_debet[$key], 0, 1) == '1') {
			// 		$data['status_kwitansi'] = 'masuk';
			// 	}
			// 	if (substr($akun_kredit[$key], 0, 1) == '1') {
			// 		$data['status_kwitansi'] = 'keluar';
			// 	}

      console.log("---------");
      console.log(division_id);
      console.log(invoice);
      console.log("---------");


      // insert 
      // const primary_id = body.primary_id;
      // const prefix = body.prefix;
      // const nomor_akun = prefix + body.nomor;
      // const nama_akun = body.nama;

      // // insert process
      // const insert = await Kas_keluar_masuk.create(
      //   {
      //     division_id: '',
      //     invoice: '',
      //     dibayar_diterima: '', 
      //     petugas: '',
      //     status_kwitansi: '',
      //     createdAt: myDate,
      //     updatedAt: myDate,
      //   },
      //   {
      //     transaction: this.t,
      //   }
      // );

      // write log message
      this.message = `Menambahkan Akun Baru dengan Nama Akun : ${body.nama}, Nomor Akun : ${nomor_akun} dan ID Akun : ${insert.id}`;
    } catch (error) {

      console.log("********1");
      console.log(error);
      console.log("********1");
      this.state = false;
    }
  }


  // async create_kamar() {
  //   await this.initialize();
  //   const { hotel_id, tipe_kamar, kapasitas_kamar, jamaah_ids } = this.req.body;
  //   const t = await sequelize.transaction();

  //   try {
  //     const formattedTipeKamar = tipe_kamar.toLowerCase().replace("-", "_");

  //     const newKamar = await Kamar.create(
  //       {
  //         company_id: this.company_id,
  //         hotel_id: hotel_id,
  //         tipe_kamar: formattedTipeKamar,
  //         kapasitas_kamar: kapasitas_kamar,
  //       },
  //       { transaction: t }
  //     );

  //     if (jamaah_ids && jamaah_ids.length > 0) {
  //       const kamarJamaahData = jamaah_ids.map((paket_transaction_id) => ({
  //         kamar_id: newKamar.id,
  //         paket_transaction_id: paket_transaction_id,
  //       }));
  //       await Kamar_jamaah.bulkCreate(kamarJamaahData, { transaction: t });
  //     }

  //     await t.commit();
  //     return { success: true, message: "Kamar berhasil ditambahkan." };
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error di model_cud create_kamar:", error);
  //     throw new Error("Gagal saat menyimpan data kamar ke database.");
  //   }
  // }

  // async update_kamar(id) {
  //   await this.initialize();
  //   const { hotel_id, tipe_kamar, kapasitas_kamar, jamaah_ids } = this.req.body;

  //   const t = await sequelize.transaction();
  //   try {
  //     const kamarToUpdate = await Kamar.findByPk(id, { transaction: t });
  //     if (!kamarToUpdate) {
  //       throw new Error("Kamar tidak ditemukan untuk diperbarui.");
  //     }

  //     const formattedTipeKamar = tipe_kamar.toLowerCase().replace("-", "_");

  //     await kamarToUpdate.update(
  //       {
  //         hotel_id: hotel_id,
  //         tipe_kamar: formattedTipeKamar,
  //         kapasitas_kamar: kapasitas_kamar,
  //       },
  //       { transaction: t }
  //     );

  //     await Kamar_jamaah.destroy({ where: { kamar_id: id }, transaction: t });

  //     if (jamaah_ids && jamaah_ids.length > 0) {
  //       const kamarJamaahData = jamaah_ids.map((paket_transaction_id) => ({
  //         kamar_id: id,
  //         paket_transaction_id: paket_transaction_id,
  //       }));
  //       await Kamar_jamaah.bulkCreate(kamarJamaahData, { transaction: t });
  //     }

  //     await t.commit();
  //     return { success: true, message: "Kamar berhasil diperbarui." };
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error di model_cud update_kamar:", error);
  //     throw new Error("Gagal saat memperbarui data kamar.");
  //   }
  // }

  // async delete_kamar(id) {
  //   await this.initialize();

  //   const t = await sequelize.transaction();
  //   try {
  //     const kamarToDelete = await Kamar.findOne({
  //       where: {
  //         id: id,
  //         company_id: this.company_id,
  //       },
  //       transaction: t,
  //     });

  //     if (!kamarToDelete) {
  //       throw new Error(
  //         "Kamar tidak ditemukan atau Anda tidak memiliki akses untuk menghapus."
  //       );
  //     }

  //     await Kamar_jamaah.destroy({
  //       where: { kamar_id: id },
  //       transaction: t,
  //     });

  //     await kamarToDelete.destroy({ transaction: t });

  //     await t.commit();
  //     return { success: true, message: "Kamar berhasil dihapus." };
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error di model_cud delete_kamar:", error);
  //     throw new Error("Gagal saat menghapus data kamar dari database.");
  //   }
  // }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      // commit
      await this.t.commit();
      return true;
    } else {
      // rollback
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = model_cud;
