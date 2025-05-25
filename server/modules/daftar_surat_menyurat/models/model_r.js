const {
  Op,
  Konfigurasi_surat_menyurat,
  Riwayat_surat_menyurat,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async get_konfigurasi_surat() {
    await this.initialize();
    try {
      const config = await Konfigurasi_surat_menyurat.findOne({
        where: {
          company_id: this.company_id,
        },
      });

      if (!config) {
        return null;
      }

      const data = {
        id: config.id,
        nama_tanda_tangan: config.nama_tanda_tangan,
        jabatan_tanda_tangan: config.jabatan_tanda_tangan,
        alamat_tanda_tangan: config.alamat_tanda_tangan,
        nama_perusahaan: config.nama_perusahaan,
        izin_perusahaan: config.izin_perusahaan,
        kota_perusahaan: config.kota_perusahaan,
        provinsi_perusahaan: config.provinsi_perusahaan,
        alamat_perusahaan: config.alamat_perusahaan,
        no_kontak_perusahaan: config.no_kontak_perusahaan,
        website_perusahaan: config.website_perusahaan,
        email_perusahaan: config.email_perusahaan,
      };

      return data;
    } catch (error) {
      console.error("Error konfigurasi_surat:", error);
      return null;
    }
  }

  async daftar_riwayat_surat() {
    await this.initialize();
    try {
      const raw = await Riwayat_surat_menyurat.findAll({
        where: {
          company_id: this.company_id,
        },
        order: [["id", "DESC"]],
      });

      const data = raw.map((item) => ({
        nomor_surat: item.nomor_surat,
        tipe_surat: item.tipe_surat,
        petugas: item.nama_petugas,
        tanggal_surat: moment(item.tanggal_surat).format("YYYY-MM-DD"),
        info: item.info,
        tujuan: item.tujuan,
        nama_petugas: item.nama_petugas,
      }));

      return data;
    } catch (error) {
      console.error("Error daftar_riwayat_surat:", error);
      return null;
    }
  }
}

module.exports = Model_r;
