const { 
  sequelize,
  Op,
  Company,
  Division,
  Paket_transaction,
  Paket_transaction_payment_history,
  Jamaah,
  Member,
  Deposit,
  Handover_fasilitas,
  Handover_fasilitas_paket,
  Handover_barang,
  Handover_barang_paket,
  } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, getCabang, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.division_id;
    this.company_id;
  } 

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async penerima() {
    this.tipe = await tipe(this.req);

    if (this.tipe === "administrator") {
      const company = await Company.findOne({
        where: { id: this.company_id },
      });
      return company?.company_name ?? "Unknown Company";
    }

    if (this.tipe === "staff") {
      const member = await Member.findOne({
        where: { company_id: this.company_id },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }
  
  // ==== UPDATE MANIFEST PAKET ====
  async updateManifestPaket() {
    await this.initialize();
    const body = this.req.body;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const model_r = new Model_r(this.req);
      const infoManifestPaket = await model_r.infoManifestPaket(body.id, this.division_id);

      await Jamaah.update(
        {
          nomor_passport: body.nomor_passport,
          tanggal_di_keluarkan_passport: body.tanggal_di_keluarkan_passport === "" ? null : body.tanggal_di_keluarkan_passport,
          tempat_di_keluarkan_passport: body.tempat_di_keluarkan_passport,
          masa_berlaku_passport: body.masa_berlaku_passport === "" ? null : body.masa_berlaku_passport,
          updatedAt: dateNow,
        }, {
          where: {
            id: infoManifestPaket.jamaah_id,
          }, transaction: this.t }
      );

      await Member.update(
        {
          fullname: body.fullname,
          birth_date: body.birth_date === "" ? null : body.birth_date,
          birth_place: body.birth_place,
          updatedAt: dateNow
        }, {
          where: {
            id: infoManifestPaket.Jamaah.member_id,
          }, transaction: this.t }
      );
      
      this.message = `Mengupdate manifest paket transaksi paket id: ${ body.id } dengan jamaah id: ${infoManifestPaket.jamaah_id}`;
    } catch (error) {
      console.log("Error in updateManifestPaket: ", error);
      this.state = false;
    }
  }

  // response
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

module.exports = Model_cud;
