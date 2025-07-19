const express = require("express");
const { body, query } = require("express-validator");
const controllers = require("../modules/trans_tiket/controllers/index");
const controller_r = require("../modules/refund_tiket/controllers/index");
const controller_r2 = require("../modules/reschelude_tiket/controllers/index");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

console.log("Controllers Object:", controllers);

router.post(
  "/trans_tiket/add_tiket",
  authenticateToken,
  [
    body("tickets")
      .notEmpty()
      .withMessage("Tickets tidak boleh kosong.")
      .custom((value) => {
        let parsed;
        try {
          parsed = typeof value === "string" ? JSON.parse(value) : value;
        } catch (err) {
          throw new Error("Format tickets tidak valid (harus JSON).");
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("Tickets harus berupa array dan tidak boleh kosong.");
        }

        parsed.forEach((ticket, index) => {
          if (!ticket.pax || isNaN(ticket.pax)) {
            throw new Error(`Ticket #${index + 1}: pax tidak valid.`);
          }
          if (!ticket.customer_price || isNaN(ticket.customer_price)) {
            throw new Error(
              `Ticket #${index + 1}: customer_price tidak valid.`
            );
          }
        });

        return true;
      }),
    body("customer")
      .notEmpty()
      .withMessage("Customer tidak boleh kosong.")
      .custom((value) => {
        let parsed;
        try {
          parsed = typeof value === "string" ? JSON.parse(value) : value;
        } catch (err) {
          throw new Error("Format customer tidak valid (harus JSON).");
        }

        if (parsed.dibayar == null || isNaN(parsed.dibayar)) {
          throw new Error("Field 'dibayar' pada customer tidak valid.");
        }
        if (!parsed.kostumer_id) {
          throw new Error("Field 'kostumer_id' pada customer harus diisi.");
        }

        return true;
      }),

    body("nomor_register")
      .notEmpty()
      .withMessage("Nomor register harus diisi."),
    body("invoice").optional(), // Invoice bisa kosong jika dibayar = 0
  ],
  controllers.addTiket
);

router.get(
  "/trans_tiket/generate_nomor_register",
  authenticateToken,
  controllers.generateNomorRegister
);
router.get(
  "/trans_tiket/generate_nomor_invoice",
  authenticateToken,
  controllers.generateNomorInvoice
);
router.get(
  "/trans_tiket/ticket_transactions",
  authenticateToken,
  [
    query("pageNumber")
      .trim()
      .notEmpty()
      .withMessage("Page Number tidak boleh kosong."),
    query("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    query("search").trim(),
  ],
  controllers.getTicketTransactions
);

router.get(
  "/trans_tiket/get-airlines",
  authenticateToken,
  controllers.getAirlines
);

router.post(
  "/trans_tiket/add_pembayaran",
  authenticateToken,
  [
    body("ticket_transaction_id")
      .notEmpty()
      .withMessage("Ticket Transaction wajib diisi"),
    body("costumer_name").notEmpty().withMessage("Nama wajib diisi"),
    body("nominal").notEmpty().withMessage("Nominal wajib diisi"),
  ],
  controllers.add_pembayaran_ticket
);

router.post(
  "/trans_tiket/detail",
  authenticateToken,
  [
    body("register_number")
      .notEmpty()
      .withMessage("Ticket Registrasi wajib diisi"),
  ],
  controllers.detail_ticket
);

router.post(
  "/trans_tiket/detail_refund",
  authenticateToken,
  [
    body("register_number")
      .notEmpty()
      .withMessage("Ticket Registrasi wajib diisi"),
  ],
  controller_r.refund_tiket_detail
);

router.post(
  "/trans_tiket/refund",
  authenticateToken,
  [
    body("nomor_register")
      .notEmpty()
      .withMessage("Ticket Registrasi wajib diisi"),
    body("detail")
      .isArray({ min: 1 })
      .withMessage("Detail refund harus berupa array dan minimal 1 data"),

    body("detail.*.refund")
      .notEmpty()
      .withMessage("Nilai refund wajib diisi")
      .isNumeric()
      .withMessage("Nilai refund harus berupa angka"),

    body("detail.*.fee")
      .notEmpty()
      .withMessage("Nilai fee wajib diisi")
      .isNumeric()
      .withMessage("Nilai fee harus berupa angka"),
  ],
  controller_r.refund_tiket
);

router.post(
  "/trans_tiket/detail_reschedule",
  authenticateToken,
  [
    body("nomor_register")
      .notEmpty()
      .withMessage("Ticket Registrasi wajib diisi"),
  ],
  controller_r2.detail_reschedule
);

router.post(
  "/trans_tiket/reschedule",
  authenticateToken,
  [
    body("ticket_transaction_id")
      .notEmpty()
      .withMessage("ID transaksi tiket wajib diisi")
      .isInt()
      .withMessage("ID transaksi harus berupa angka"),

    body("details")
      .isArray({ min: 1 })
      .withMessage(
        "Detail reschedule wajib berbentuk array dan tidak boleh kosong"
      ),
    body("details.*.ticket_transaction_detail_id")
      .notEmpty()
      .withMessage("ID detail transaksi wajib diisi"),
    body("details.*.departure_date")
      .notEmpty()
      .withMessage("Tanggal keberangkatan baru wajib diisi"),
    body("details.*.travel_price")
      .notEmpty()
      .withMessage("Harga travel wajib diisi"),
    body("details.*.costumer_price")
      .notEmpty()
      .withMessage("Harga customer wajib diisi"),
    body("details.*.code_booking")
      .notEmpty()
      .withMessage("Kode booking wajib diisi"),
  ],
  controller_r2.reschelude
);

router.get(
  "/trans_tiket/daftar_customer",
  authenticateToken,
  controllers.daftar_customer
);

body("costumer_name").notEmpty().withMessage("Nama customer wajib diisi"),
  router.post(
    "/trans_tiket/daftar_paket",
    authenticateToken,
    [
      body("division_id")
        .trim()
        .notEmpty()
        .withMessage("ID  tidak boleh kosong."),
    ],
    controllers.daftar_paket
  );
module.exports = router;
