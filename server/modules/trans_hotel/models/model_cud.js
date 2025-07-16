const {
  Hotel_transaction,
  Hotel_transaction_detail,
  sequelize,
  Company,
  Users,
  Member,
} = require("../../../models");
const moment = require("moment");
const { Op } = require("sequelize");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const { writeLog } = require("../../../helper/writeLogHelper");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    // initialize transaction
    this.state = true;
  }

  async transaction() {
    this.t = await sequelize.transaction();
  }

  async penerima() {
    await this.initialize();
    const role = await tipe(this.req);

    if (role === "administrator") {
      const company = await Company.findOne({ where: { id: this.company_id } });
      return company?.company_name ?? "Unknown Company";
    }

    if (role === "staff") {
      const staff = await Users.findOne({
        where: { division_id: this.division },
        include: [{ model: Member, attributes: ["fullname"] }],
      });
      return staff?.Member?.fullname ?? "Unknown Staff";
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

  async tambah_transaksi_hotel() {
    await this.initialize();
    await this.transaction();
    const petugas = await this.penerima();
    const invoice = await this.generate_invoice();

    const body = this.req.body;
    const my_date = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("Data Body:", body);

    try {
      // 1. Insert transaksi utama
      const transaksi = await Hotel_transaction.create(
        {
          company_id: this.company_id,
          invoice: invoice,
          petugas: petugas,
          kostumer_id: body.kostumer_id || "-",
          paket_id: body.paket_id || null,
          createdAt: my_date,
          updatedAt: my_date,
        },
        { transaction: this.t }
      );

      // 2. Insert semua tamu ke details
      const detailData = body.details.map((d) => ({
        hotel_transaction_id: transaksi.id,
        name: d.name,
        birth_date: d.birth_date,
        birth_place: d.birth_place,
        identity_number: d.identity_number,
        mst_hotel_id: d.mst_hotel_id,
        mst_kota_id: d.mst_kota_id,
        price: d.price,
        check_in: d.check_in,
        check_out: d.check_out,
        createdAt: my_date,
        updatedAt: my_date,
      }));

      await Hotel_transaction_detail.bulkCreate(detailData, {
        transaction: this.t,
      });

      this.invoice = invoice;
      this.message = "Transaksi hotel berhasil disimpan.";
    } catch (error) {
      this.message = "Gagal simpan transaksi hotel: " + error.message;
      this.state = false;
      console.error(error);
    }
  }

  async hapus_transaksi_hotel() {
    await this.initialize();
    await this.transaction();

    const { id } = this.req.body;

    if (!Number(id)) {
      this.state = false;
      this.message = "ID hotel harus berupa angka";
      return;
    }

    try {
      const transaksi = await Hotel_transaction.findOne({
        where: {
          id: Number(id),
          company_id: this.company_id,
        },
      });

      if (!transaksi) {
        this.state = false;
        this.message = "Transaksi hotel tidak ditemukan.";
        return;
      }

      // Hapus detail anaknya dulu
      await Hotel_transaction_detail.destroy({
        where: { hotel_transaction_id: transaksi.id },
        transaction: this.t,
      });

      // Hapus data induknya
      await Hotel_transaction.destroy({
        where: { id: transaksi.id },
        transaction: this.t,
      });

      this.message = "Transaksi hotel berhasil dihapus.";
    } catch (error) {
      this.state = false;
      this.message = "Gagal hapus transaksi hotel: " + error.message;
      console.error(error);
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
