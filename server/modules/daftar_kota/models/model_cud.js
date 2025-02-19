const { Mst_kota } = require("../../../models");
const validator = require("validator");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  // Tambah Kota
  async create_daftar_kota({ company_id, kode, name }) {
    try {
      // Validasi input
      if (!company_id || !kode || !name) {
        throw new Error("Semua field harus diisi.");
      }

      // Sanitasi input
      kode = validator.trim(kode);
      name = validator.escape(validator.trim(name));

      // Cek apakah kota dengan kode tersebut sudah ada di company ID
      const existingKota = await Mst_kota.findOne({ where: { kode, company_id } });
      if (existingKota) {
        throw new Error("Kode kota sudah digunakan di company ID ini.");
      }

      // Simpan data
      return await Mst_kota.create({ company_id, kode, name });
    } catch (error) {
      throw new Error(`Gagal menambahkan kota: ${error.message}`);
    }
  }

  // Update Kota
  async update_daftar_kota({ id, company_id, kode, name }) {
    try {
      if (!id || !company_id || !kode || !name) {
        return { error: true, message: "Semua field harus diisi." };
      }
  
      // Cari data berdasarkan ID dan company_id
      const kota = await Mst_kota.findOne({ where: { id, company_id } });
      if (!kota) {
        return { error: true, message: "Kota tidak ditemukan atau bukan milik perusahaan ini." };
      }
  
      // Cek apakah kode kota sudah dipakai oleh kota lain
      const existingKota = await Mst_kota.findOne({ where: { kode, company_id } });
      if (existingKota && existingKota.id !== Number(id)) {
        return { error: true, message: "Kode kota sudah digunakan di company ID ini." };
      }
  
      // Update data
      await kota.update({ kode, name });
  
      return { error: false, message: "Kota berhasil diperbarui.", data: kota };
    } catch (error) {
      return { error: true, message: `Gagal memperbarui kota: ${error.message}` };
    }
  }
  

  // Hapus Kota
  async delete_daftar_kota({ id, company_id }) {
    try {
      if (!id || !company_id) {
        return { error: true, message: "ID kota dan company ID harus disertakan." };
      }
  
      // Cek apakah kota ada dan milik company yang sesuai
      const kota = await Mst_kota.findOne({ where: { id, company_id } });
      if (!kota) {
        return { error: true, message: "Kota tidak ditemukan atau bukan milik perusahaan ini." };
      }
  
      // Hapus data
      await kota.destroy();
      return { error: false, message: "Kota berhasil dihapus." };
    } catch (error) {
      return { error: true, message: `Gagal menghapus kota: ${error.message}` };
    }
  }  
}

module.exports = Model_cud;
