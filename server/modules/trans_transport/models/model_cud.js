const {
  Transport_transaction,
  Transport_transaction_detail,
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

  async tambah_transaksi_transport() {
    await this.initialize();
    await this.transaction();
    const petugas = await this.penerima();
    const invoice = await this.generate_invoice();

    const body = this.req.body;
    const my_date = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // 1. Insert transaksi utama
      const transaksi = await Transport_transaction.create(
        {
          company_id: this.company_id,
          invoice: invoice,
          petugas: petugas,
          payer: body.name || "-",
          payer_identity: body.identity_number || "-",
          address: body.address || "-",
          createdAt: my_date,
          updatedAt: my_date,
        },
        { transaction: this.t }
      );

      // 2. Insert banyak detail mobil
      const detailData = body.details.map((d) => ({
        transport_transaction_id: transaksi.id,
        mst_mobil_id: d.mst_mobil_id,
        car_number: d.car_number,
        price: d.price,
        createdAt: my_date,
        updatedAt: my_date,
      }));

      await Transport_transaction_detail.bulkCreate(detailData, {
        transaction: this.t,
      });

      this.invoice = invoice;
      this.message = "Transaksi Transport berhasil disimpan.";
    } catch (error) {
      this.message = "Gagal simpan transaksi Transport: " + error.message;
      this.state = false;
      console.error(error);
    }
  }

  async hapus_transaksi_transport() {
    await this.initialize();
    await this.transaction();

    const { id } = this.req.body;

    if (!Number(id)) {
      this.state = false;
      this.message = "ID Transport harus berupa angka";
      return;
    }

    try {
      const transaksi = await Transport_transaction.findOne({
        where: {
          id: Number(id),
          company_id: this.company_id,
        },
      });

      if (!transaksi) {
        this.state = false;
        this.message = "Transaksi Transport tidak ditemukan.";
        return;
      }

      // Hapus detail anaknya dulu
      await Transport_transaction_detail.destroy({
        where: { transport_transaction_id: transaksi.id },
        transaction: this.t,
      });

      // Hapus data induknya
      await Transport_transaction.destroy({
        where: { id: transaksi.id },
        transaction: this.t,
      });

      this.message = "Transaksi Transport berhasil dihapus.";
    } catch (error) {
      this.state = false;
      this.message = "Gagal hapus transaksi Transport: " + error.message;
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
