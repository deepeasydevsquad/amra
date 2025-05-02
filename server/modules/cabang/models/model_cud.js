const { sequelize, Division, Mst_kota, Company } = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { writeLog } = require("../../../helper/writeLogHelper");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.t; // Transaction object
    this.state = true; // State untuk menandai sukses/gagal
    this.message = ""; // Pesan log
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction(); // Inisialisasi transaction
  }

  // ✅ Validasi berdasarkan ID kota
  async validateCityId(cityId) {
    return (await Mst_kota.findByPk(cityId)) !== null;
  }

  validateSignatureFile(file) {
    if (!file) return "Tanda tangan wajib diunggah.";
    if (file.mimetype !== "image/png") return "File harus berformat PNG.";
    if (file.size > 1024 * 1024) return "Ukuran file maksimal 1MB.";
    return null;
  }

  // ✅ Tambah Division
  async createDivision() {
    await this.initialize();
    const { city, name, pos_code, address, note } = this.req.body;

    const file = this.req.file;

    try {
      // Validasi file tanda tangan
      const fileError = this.validateSignatureFile(file);
      if (fileError) {
        throw new Error(fileError);
      }

      // Ambil data kota dari database
      const cityData = await Mst_kota.findOne({ where: { id: city } });
      if (!cityData) {
        throw new Error("ID kota tidak valid.");
      }

      // Insert process
      const division = await Division.create(
        {
          company_id: this.company_id,
          kota_id : city,
          name,
          pos_code,
          address,
          note,
          tanda_tangan: file.filename,
        },
        {
          transaction: this.t,
        }
      );

      // Set log message
      this.message = `Menambahkan Division Baru dengan Nama Kota: ${cityData.name}, Kode Pos: ${pos_code}, dan ID Division: ${division.id}`;

      // Write log
      await writeLog(this.req, this.t, {
        msg: this.message,
      });

      // Commit transaction
      await this.t.commit();
      return { success: true, data: division };
    } catch (error) {
      // Rollback transaction jika terjadi error
      await this.t.rollback();
      console.error("Error saat menambahkan division:", error.message);
      return { success: false, error: error.message };
    }
  }

  // ✅ Update Division
  async updateDivision(id) {
    await this.initialize();
    const { city, name, pos_code, address, note } = this.req.body;

    const file = this.req.file;

    try {
      // Cek apakah division ada
      const division = await Division.findOne({
        where: { id, company_id: this.company_id },
      });
      if (!division) {
        throw new Error("Division tidak ditemukan.");
      }

      // Cek apakah city (ID kota) valid
      if (!(await this.validateCityId(city))) {
        throw new Error("ID kota tidak valid.");
      }

      // Ambil nama kota berdasarkan ID kota
      const cityData = await Mst_kota.findOne({ where: { id: city } });
      if (!cityData) {
        throw new Error("Kota tidak ditemukan.");
      }

      // Validasi file tanda tangan jika ada
      if (file) {
        const fileError = this.validateSignatureFile(file);
        if (fileError) {
          throw new Error(fileError);
        }
        division.tanda_tangan = file.filename;
      }

      // Update process
      await division.update(
        {
          city_id: city,
          city: cityData.name,
          name,
          pos_code,
          address,
          note,
        },
        {
          transaction: this.t,
        }
      );

      // Set log message
      this.message = `Memperbaharui Data Division dengan ID: ${id}, Nama Kota: ${cityData.name}, Kode Pos: ${pos_code}`;

      // Write log
      await writeLog(this.req, this.t, {
        msg: this.message,
      });

      // Commit transaction
      await this.t.commit();
      return { success: true, data: division };
    } catch (error) {
      // Rollback transaction jika terjadi error
      await this.t.rollback();
      console.error("Error saat mengupdate division:", error.message);
      return { success: false, error: error.message };
    }
  }

  // ✅ Delete Division
  async deleteDivision(id) {
    await this.initialize();

    try {
      // Cek jumlah cabang yang tersisa
      const totalCabang = await Division.count({
        where: { company_id: this.company_id },
      });
      if (totalCabang <= 1) {
        throw new Error(
          "Tidak dapat menghapus cabang karena harus ada minimal 1 cabang tersisa."
        );
      }

      // Cek apakah cabang yang ingin dihapus adalah tempat admin berada
      const adminCabang = await Company.findOne({
        where: { id: this.company_id },
        attributes: ["division_id"], // Asumsi 'division_id' menyimpan cabang admin
      });

      if (adminCabang && adminCabang.division_id === id) {
        throw new Error("Cabang tempat admin berada tidak dapat dihapus.");
      }

      // Cari cabang yang akan dihapus
      const division = await Division.findOne({
        where: { id, company_id: this.company_id },
      });
      if (!division) {
        throw new Error("Division tidak ditemukan.");
      }

      // Delete process
      await division.destroy({
        transaction: this.t,
      });

      // Set log message
      this.message = `Menghapus Division dengan ID: ${id}, Nama Kota: ${division.city}`;

      // Write log
      await writeLog(this.req, this.t, {
        msg: this.message,
      });

      // Commit transaction
      await this.t.commit();
      return { success: true, message: "Division berhasil dihapus." };
    } catch (error) {
      // Rollback transaction jika terjadi error
      await this.t.rollback();
      console.error("Error saat menghapus division:", error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Model_cud;
