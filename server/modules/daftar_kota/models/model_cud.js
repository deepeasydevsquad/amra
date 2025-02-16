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

      // Cek apakah kota dengan kode tersebut sudah ada
      const existingKota = await Mst_kota.findOne({ where: { kode } });
      if (existingKota) {
        throw new Error("Kode kota sudah digunakan.");
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
      // Validasi input
      if (!id || !company_id || !kode || !name) {
        throw new Error("Semua field harus diisi.");
      }

      // Sanitasi input
      kode = validator.trim(kode);
      name = validator.escape(validator.trim(name));

      // Cek apakah kota ada di database
      const kota = await Mst_kota.findByPk(id);
      if (!kota) {
        throw new Error("Kota tidak ditemukan.");
      }

      // Update data
      await kota.update({ company_id, kode, name });

      return { message: "Kota berhasil diperbarui.", data: kota };  
    } catch (error) {
      throw new Error(`Gagal memperbarui kota: ${error.message}`);
    }
  }

  // Hapus Kota
  async delete_daftar_kota({ id }) {
    try {
      if (!id) {
        throw new Error("ID kota harus disertakan.");
      }

      // Cek apakah kota ada
      const kota = await Mst_kota.findByPk(id);
      if (!kota) {
        throw new Error("Kota tidak ditemukan.");
      }

      // Hapus data
      await kota.destroy();
      return { message: "Kota berhasil dihapus." };
    } catch (error) {
      throw new Error(`Gagal menghapus kota: ${error.message}`);
    }
  }
  
}

module.exports = Model_cud;
