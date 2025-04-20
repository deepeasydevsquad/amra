const { System_log, Company } = require("../../../models");

class Model_r {
  constructor() {
    this.System_log = System_log;
    this.Company = Company;
  }

  /**
   * Mengambil data log travel dari tabel system_log.
   * @returns {Promise<Array>} - Array of formatted log data.
   * @throws {Error} - Jika terjadi error saat mengambil data.
   */
  async getTravelLogs() {
    try {
      // Ambil data log dari tabel system_log yang terkait dengan travel
      const logs = await this.System_log.findAll({
        include: [
          {
            model: this.Company,
            // Filter perusahaan dengan type "travel"
            attributes: ["company_name"], // Ambil nama perusahaan untuk informasi tambahan
          },
        ],
        attributes: ["msg", "user_id", "log_ip", "createdAt"], // Kolom yang ingin diambil dari system_log
        order: [["createdAt", "DESC"]], // Urutkan berdasarkan tanggal transaksi terbaru
      });

      // Format data log yang diambil
      const formattedLogs = logs.map((log) => {
        const logMsg = log.msg;
        const userName =
          log.user_id === 0 ? "Administrator" : `Staff (ID: ${log.user_id})`;
        const transactionDate = log.createdAt;
        const logIpAccess = log.log_ip;
        const companyName = log.Company ? log.Company.company_name : "Unknown"; // Ambil nama perusahaan

        return {
          logMsg,
          userName,
          transactionDate,
          logIpAccess,
          companyName, // Tambahkan nama perusahaan ke hasil
        };
      });

      return formattedLogs;
    } catch (error) {
      console.error("Error fetching travel logs:", error);
      throw error;
    }
  }
}

module.exports = Model_r;
