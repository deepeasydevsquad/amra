const express = require("express");
const { body, query } = require("express-validator");
const controllers = require("../modules/trans_tiket/controllers/index");
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
        if (!parsed.costumer_name) {
          throw new Error("Field 'costumer_name' pada customer harus diisi.");
        }
        if (!parsed.costumer_identity) {
          throw new Error(
            "Field 'costumer_identity' pada customer harus diisi."
          );
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
    body("costumer_identity").notEmpty().withMessage("Identitas wajib diisi"),
    body("nominal").notEmpty().withMessage("Nominal wajib diisi"),
  ],
  controllers.add_pembayaran_ticket
);

module.exports = router;
