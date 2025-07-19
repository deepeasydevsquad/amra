const {
  sequelize,
  Ticket_transaction,
  Ticket_transaction_detail,
  Ticket_transaction_refund,
  Ticket_payment_history,
  Users,
  Member,
  Company,
} = require("../../../models");

const {
  getCabang,
  tipe,
  getCompanyIdByCode,
} = require("../../../helper/companyHelper");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.division_id = null;
    this.company_id = null;
    this.division = null;
    this.t = null;
    this.state = true;
    this.message = "Berhasil melakukan refund tiket";
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.division = await getCabang(this.req);
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async penerima() {
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

  async refund_tiket() {
    await this.initialize();
    const Invoice = await this.generate_invoice();
    const petugas = await this.penerima();
    const body = this.req.body;
    const nomor_register = body.nomor_register;
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const transaksi = await Ticket_transaction.findOne({
        where: { nomor_register },
        include: [{ model: Ticket_transaction_detail }],
      });

      if (!transaksi) {
        this.state = false;
        this.message = "Transaksi tidak ditemukan";
        return;
      }

      await Ticket_transaction.update(
        { status: "refund", total_transaksi: 0 },
        { where: { nomor_register }, transaction: this.t }
      );

      // ⬇️ Tambahkan totalRefund
      let totalRefund = 0;

      for (let i = 0; i < transaksi.Ticket_transaction_details.length; i++) {
        const detail = transaksi.Ticket_transaction_details[i];

        const refund = body.detail[i]?.refund ?? 0;
        const fee = body.detail[i]?.fee ?? 0;

        totalRefund += refund;

        await Ticket_transaction_refund.create(
          {
            ticket_transaction_id: transaksi.id,
            pax: detail.pax,
            code_booking: detail.code_booking,
            departure_date: detail.departure_date,
            travel_price: detail.travel_price,
            costumer_price: detail.costumer_price,
            airlines_id: detail.airlines_id,
            refund,
            fee,
            petugas,
            createdAt: dateNow,
            updatedAt: dateNow,
          },
          { transaction: this.t }
        );
      }

      await Ticket_payment_history.create(
        {
          ticket_transaction_id: transaksi.id,
          nominal: totalRefund,
          invoice: Invoice,
          kostumer_id: body.kostumer_id,
          status: "refund",
          petugas,
          createdAt: dateNow,
          updatedAt: dateNow,
        },
        { transaction: this.t }
      );

      this.message = "Berhasil melakukan refund tiket";
    } catch (error) {
      this.state = false;
      this.message = "Terjadi kesalahan saat refund tiket";
      console.error("refund_tiket error:", error);
    }
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
