const {
  sequelize,
  Passport_transaction,
  Passport_transaction_detail,
  Company,
  Member,
} = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.t;
    this.state = true;
    this.message = "";
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.t = await sequelize.transaction();
    this.state = true;
  }

  //Menentukan nama petugas berdasarkan role dari token JWT.
  async petugas() {
    const role = await tipe(this.req);

    if (!this.company_id) {
      console.error("DEBUG [petugas]: GAGAL KARENA company_id KOSONG!");
      return "Error: Company ID tidak ditemukan";
    }

    if (role === "administrator") {
      const company = await Company.findOne({ where: { id: this.company_id } });

      return company?.company_name ?? "Unknown Company";
    }

    if (role === "staff") {
      console.log("DEBUG [petugas]: Mencari data member sebagai staff...");
      const member = await Member.findOne({
        where: { company_id: this.company_id, role: "staff" },
        order: [["id", "DESC"]],
      });
      return member?.fullname ?? "Unknown Staff";
    }

    return "Tipe user tidak diketahui";
  }

  async generate_invoice() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = () => {
      return (
        letters[Math.floor(Math.random() * 26)] +
        letters[Math.floor(Math.random() * 26)]
      );
    };

    const randomNumbers = () => {
      return Math.floor(10 + Math.random() * 90);
    };

    return `${randomLetters()}${randomNumbers()}`;
  }

  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const invoice = await this.generate_invoice();

    try {
      const namaPetugas = await this.petugas();
      if (namaPetugas.startsWith("Error:") || namaPetugas.includes("Unknown")) {
        throw new Error(
          `Gagal menentukan petugas yang valid. Diterima: ${namaPetugas}`
        );
      }
      const newTransaction = await Passport_transaction.create(
        {
          invoice: invoice,
          company_id: this.company_id,
          petugas: namaPetugas,
          kostumer_id: body.kostumer_id,
          paket_id: body.paket_id,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      const newTransactionId = newTransaction.id;

      if (body.passport_details && Array.isArray(body.passport_details)) {
        for (const detail of body.passport_details) {
          await Passport_transaction_detail.create(
            {
              passport_transaction_id: newTransactionId,
              name: detail.name,
              identity_number: detail.identity_number,
              birth_place: detail.birth_place,
              birth_date: detail.birth_date,
              kk_number: detail.kk_number,
              address: detail.address,
              mst_kota_id: detail.city,
              price: detail.price,
              createdAt: myDate,
              updatedAt: myDate,
            },
            { transaction: this.t }
          );
        }
      } else {
        throw new Error(
          "Data detail passport tidak ditemukan atau tidak valid."
        );
      }

      await this.t.commit();
      this.message = `Menambahkan Transaksi Passport Baru untuk : ${body.payer} dengan ID Transaksi : ${newTransactionId} oleh petugas: ${namaPetugas}`;
    } catch (error) {
      if (this.t) await this.t.rollback();
      console.error("Error di model CUD add:", error);
      this.state = false;
      this.message = `Gagal menambahkan transaksi: ${error.message}`;
    }
  }

  async hapus(transactionId) {
    await this.initialize();

    try {
      const namaPetugas = await this.petugas(); //
      const existingTransaction = await Passport_transaction.findOne({
        where: {
          id: transactionId,
          company_id: this.company_id,
        }, //
      });

      if (!existingTransaction) {
        throw new Error(
          "Data transaksi passport tidak ditemukan atau Anda tidak memiliki akses"
        );
      }

      // Hapus detail transaksi terlebih dahulu
      await Passport_transaction_detail.destroy({
        where: { Passport_transaction_id: transactionId },
        transaction: this.t,
      }); //

      // Hapus transaksi utama
      await Passport_transaction.destroy({
        where: {
          id: transactionId,
          company_id: this.company_id,
        },
        transaction: this.t,
      }); //

      await this.t.commit();

      this.message = `Menghapus Transaksi Passport dengan ID: ${transactionId} untuk pelanggan: ${existingTransaction.payer} oleh petugas: ${namaPetugas}`; //
    } catch (error) {
      if (this.t) await this.t.rollback();
      console.error("Error di model CUD hapus:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async response() {
    return this.state;
  }
}

module.exports = Model_cud;
