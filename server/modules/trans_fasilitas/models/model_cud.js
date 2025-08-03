const {
  Transaction_fasilitas,
  Transaction_fasilitas_detail,
  Mst_fasilitas,
  Item_fasilitas,
  Kostumer,
  Paket,
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

  async tambah_transaksi_fasilitas() {
    await this.initialize();
    await this.transaction();
    const petugas = await this.penerima();
    const invoice = await this.generate_invoice();

    const body = this.req.body;
    const my_date = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("Data Body:", body);

    try {
      // 1. Insert transaksi utama
      const transaksi = await Transaction_fasilitas.create(
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

      // 2. Hitung total harga dari semua fasilitas
      let totalPrice = 0;
      for (const detail of body.fasilitas) {
        const fasilitas = await Item_fasilitas.findOne({
          where: { id: detail.item_id },
          attributes: ["id", "harga_jual"],
        });
        if (fasilitas) {
          totalPrice += fasilitas.harga_jual;
          await Transaction_fasilitas_detail.create(
            {
              transaction_fasilitas_id: transaksi.id,
              item_fasilitas_id: fasilitas.id,
              createdAt: my_date,
              updatedAt: my_date,
            },
            { transaction: this.t }
          );
        }
      }
      transaksi.total = totalPrice;
      await transaksi.save({ transaction: this.t });

      this.invoice = invoice;
      this.message = "Transaksi fasilitas berhasil disimpan.";
    } catch (error) {
      this.message = "Gagal simpan transaksi hotel: " + error.message;
      this.state = false;
      console.error(error);
    }
  }

  async hapus_transaksi_fasilitas() {
    await this.initialize();
    await this.transaction();

    const { id } = this.req.body;

    try {
      // Hapus data induknya serta barangnya (cassecade delete)
      await Transaction_fasilitas.destroy({
        where: { id: id, company_id: this.company_id },
        transaction: this.t,
      });

      this.message = "Transaksi fasilitas berhasil dihapus.";
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
