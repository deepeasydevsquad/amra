const companyHelper = require("../../../helper/companyHelper"); // Sesuaikan path-nya
const { Company } = require("../../../models/"); // Import model Company dari Sequelize
const fs = require("fs");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null; // Inisialisasi company_id
  }

  async getCompanyId() {
    try {
      if (!this.req) {
        throw new Error("Request object is required");
      }

      const companyId = await companyHelper.getCompanyIdByCode(this.req);
      if (!companyId) {
        return { error: "Company ID tidak ditemukan" };
      }

      this.company_id = companyId; // Simpan companyId ke dalam properti instance
      return { companyId }; // Kembalikan object yang konsisten
    } catch (error) {
      console.error("Error fetching Company ID:", error);
      return {
        error: "Terjadi kesalahan saat mengambil Company ID",
        details: error.message,
      };
    }
  }

  async get_company_by_id(companyId) {
    try {
      if (!companyId) {
        return { error: "Company ID diperlukan" };
      }

      // Menggunakan Sequelize untuk mengambil data perusahaan
      const companyData = await Company.findOne({
        where: { id: companyId },
      });

      console.log("-----Logo-----");
      console.log(companyData.logo);
      console.log("-----Logo-----");

      // 
      var posisiLogo = "/uploads/pengaturan/" + companyData.logo;
      // await fs.unlink(posisiLogo, function (err) {
      //   if (err) {

      //     console.log("tidak ADA =====");
      //     companyData.logo = 'default.png';
      //   }else{
      //     console.log("===== ADA =====");
      //   }
      // });
      
      // console.log("-----Logo After-----");
      // console.log(companyData.logo);
      // console.log("-----Logo After-----");

      console.log("-----Path-----");
      console.log(posisiLogo);
      console.log("-----Path-----");

      // try {
        
      //   console.log("===== ADA =====");
      // } catch (err) {
      //   console.log("Tidak ADA =====");
      //   // if (err.code === "ENOENT") {
      //   //   console.log("Tidak ADA =====");
      //   //   companyData.logo = "default.png"; // Update jika file tidak ada
      //   // } else {
      //   //   console.error("Gagal menghapus file:", err);
      //   // }
      // }

      if ( ! await fs.existsSync(posisiLogo) ) {

        console.log("----Tidak ada----");
        companyData.logo = "default.png"; // Update jika file tidak ada
      }else{
        console.log("----Ada----");
      }


      console.log("-----Logo After-----");
      console.log(companyData);
      console.log("-----Logo After-----");

      if (companyData) {
        return companyData; // Mengembalikan data perusahaan
      } else {
        return { error: "Perusahaan tidak ditemukan" };
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      return {
        error: "Terjadi kesalahan saat mengambil data perusahaan",
        details: error.message,
      };
    }
  }
}

module.exports = Model_r;
