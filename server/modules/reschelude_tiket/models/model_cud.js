const {
  sequelize,
  Ticket_transaction,
  Ticket_transaction_detail,
  Ticket_transaction_refund,
  Ticket_payment_history,
  Ticket_reschedule_history,
  Ticket_reschedule_detail_history,
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

  async reschedule_tiket() {
    await this.initialize();
    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const invoice = await this.generate_invoice();
    const petugas = await this.penerima();

    try {
      // 1. Ambil data transaksi lama (include detail-nya)
      const transaksi = await Ticket_transaction.findOne({
        where: { id: body.ticket_transaction_id },
        include: [{ model: Ticket_transaction_detail }],
        transaction: this.t,
      });

      if (!transaksi) {
        throw new Error("Transaksi tidak ditemukan.");
      }

      // 2. Hitung total transaksi baru dari costumer_price yang baru
      const newTotalTransaction = body.details.reduce(
        (total, d) => total + Number(d.costumer_price || 0),
        0
      );

      // 3. Insert ke Ticket_reschedule_history (backup data utama)
      const tiket_reschedule = await Ticket_reschedule_history.create(
        {
          division_id: this.division,
          ticket_transaction_id: transaksi.id,
          old_total_transaction: transaksi.total_transaksi,
          new_total_transaction: newTotalTransaction,
          invoice: invoice,
          costumer_name: body.costumer_name,
          costumer_identity: body.costumer_identity,
          petugas: petugas,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      // 4. Insert semua detail ke Ticket_reschedule_detail_history_
      console.log("▶️ Mulai proses insert detail reschedule...");
      console.log("📦 Jumlah detail dari body:", body.details?.length || 0);
      console.log(
        "📦 Jumlah detail dari transaksi:",
        transaksi.Ticket_transaction_details?.length || 0
      );

      for (const detailBaru of body.details) {
        console.log(
          "\n🔁 Looping detailBaru:",
          detailBaru.ticket_transaction_detail_id
        );

        const detailLama = transaksi.Ticket_transaction_details.find(
          (d) => d.id === detailBaru.ticket_transaction_detail_id
        );

        if (!detailLama) {
          console.warn(
            "❌ DetailLama gak ditemukan untuk ID:",
            detailBaru.ticket_transaction_detail_id
          );
          continue;
        }

        console.log("✅ Ditemukan detailLama:", {
          id: detailLama.id,
          pax: detailLama.pax,
          departure_date: detailLama.departure_date,
        });

        console.log("📥 Siap insert detail baru ke DB dengan data:");
        console.log({
          ticket_reschedule_history_id: tiket_reschedule.id,
          ticket_transaction_detail_id: detailLama.id,
          old_departure_date: detailLama.departure_date,
          old_travel_price: detailLama.travel_price,
          old_costumer_price: detailLama.costumer_price,
          old_code_booking: detailLama.code_booking,
          new_departure_date: detailBaru.departure_date,
          new_travel_price: detailBaru.travel_price,
          new_costumer_price: detailBaru.costumer_price,
          new_code_booking: detailBaru.code_booking,
          createdAt: myDate,
          updatedAt: myDate,
        });

        await Ticket_reschedule_detail_history.create(
          {
            ticket_reschedule_history_id: tiket_reschedule.id,
            ticket_transaction_detail_id: detailLama.id,
            old_departure_date: detailLama.departure_date,
            old_travel_price: detailLama.travel_price,
            old_costumer_price: detailLama.costumer_price,
            old_code_booking: detailLama.code_booking,
            new_departure_date: detailBaru.departure_date,
            new_travel_price: detailBaru.travel_price,
            new_costumer_price: detailBaru.costumer_price,
            new_code_booking: detailBaru.code_booking,
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: this.t }
        );

        console.log("✅ Insert detail berhasil untuk ID:", detailLama.id);
      }

      console.log("🏁 Proses insert detail selesai.");

      // 5. Update total transaksi ke Ticket_transaction
      await Ticket_transaction.update(
        {
          total_transaksi: newTotalTransaction,
        },
        {
          where: { id: transaksi.id },
          transaction: this.t,
        }
      );

      // 6. Hapus semua Ticket_payment_history terkait transaksi ini
      await Ticket_payment_history.destroy({
        where: { ticket_transaction_id: transaksi.id },
        transaction: this.t,
      });
      this.invoice = invoice;
      this.message = "Berhasil melakukan reschedule tiket";
    } catch (error) {
      console.error("❌ Error saat reschedule tiket:", error);
      this.state = false;
      this.message = error.message;
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
