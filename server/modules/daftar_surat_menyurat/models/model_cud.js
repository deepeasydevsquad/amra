const { sequelize, Konfigurasi_surat_menyurat } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.company_id = null;
    this.message = "";
    this.t = null;
    this.state = true;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    // initialize transaction
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async addKonfigurasiSuratMenyurat() {
    await this.initialize();
    const body = this.req.body;
    console.log("body", body);
    let data;
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    try {
      if (body.id) {
        // Cek dulu apakah ID yang dikirim ada di database
        const existing = await Konfigurasi_surat_menyurat.findOne({
          where: { id: body.id },
        });

        if (existing) {
          // Kalau ada, update data-nya
          await Konfigurasi_surat_menyurat.update(
            { ...body },
            {
              where: { id: body.id },
              transaction: this.t,
            }
          );
          this.message = `Berhasil update Konfigurasi Surat Menyurat dengan ID: ${body.id}`;
          return;
        }
      }

      // Kalau gak ada ID, atau ID gak ditemukan, maka create baru
      data = await Konfigurasi_surat_menyurat.create(
        {
          company_id: this.company_id,
          nama_tanda_tangan: body.nama_tanda_tangan,
          jabatan_tanda_tangan: body.jabatan_tanda_tangan,
          alamat_tanda_tangan: body.alamat_tanda_tangan,
          nama_perusahaan: body.nama_perusahaan,
          izin_perusahaan: body.izin_perusahaan,
          kota_perusahaan: body.kota_perusahaan,
          provinsi_perusahaan: body.provinsi_perusahaan,
          alamat_perusahaan: body.alamat_perusahaan,
          no_kontak_perusahaan: body.no_kontak_perusahaan,
          website_perusahaan: body.website_perusahaan,
          email_perusahaan: body.email_perusahaan,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Konfigurasi Surat Menyurat Baru dengan ID: ${data.id}`;
    } catch (error) {
      this.state = false;
      console.error("Error di addKonfigurasiSuratMenyurat:", error);
    }
  }

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
