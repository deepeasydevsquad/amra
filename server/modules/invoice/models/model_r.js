const fs = require("fs");
const path = require("path");
const moment = require("moment");

const {
  Akun_secondary,
  Member,
  Deposit,
  Paket_la,
  Fasilitas_paket_la,
  Detail_fasilitas_paket_la,
  Paket_la_transaction,
  Company,
  Division,
  Jamaah,
  Tabungan,
  Riwayat_tabungan,
  Mst_kota,
  Mst_paket_type,
  Riwayat_pembayaran_peminjaman,
  Peminjaman,
  Handover_fasilitas,
  Handover_fasilitas_paket,
  Handover_fasilitas_detail,
  Handover_fasilitas_detail_paket,
  Handover_barang,
  Handover_barang_paket,
  Mst_fasilitas,
  Visa_transaction,
  Visa_transaction_detail,
  Mst_visa_request_type,
  Fee_agen,
  Pembayaran_fee_agen,
  Agen,
  Paket_transaction,
  Paket_transaction_payment_history,
  Hotel_transaction,
  Hotel_transaction_detail,
  Mst_hotel,
  Passport_transaction,
  Passport_transaction_detail,
  Transport_transaction,
  Transport_transaction_detail,
  Mst_mobil,
  Kas_keluar_masuk,
  Jurnal,
} = require("../../../models");
const { Op } = require("sequelize");
const {
  getCompanyIdByCode,
  tipe,
  getCabang,
} = require("../../../helper/companyHelper");

const { convertToRP } = require("../../../helper/currencyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id = null;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
  }

  async header() {
    await this.initialize();
    return this.header_kwitansi_invoice();
  }

  async get_akun_secondary_name(company_id) {
    var data = {};
    await Akun_secondary.findAll({
      where: { company_id: company_id },
    }).then(async (value) => {
      await Promise.all(
        await value.map(async (e) => {
          data[e.nomor_akun] = e.nama_akun;
        })
      );
    });
    return data;
  }

  async dataInvoiceKasKeluarMasuk() {
    await this.initialize();

    const list_akun = await this.get_akun_secondary_name(this.company_id);

    try {
      var data = {};
      await Kas_keluar_masuk.findOne({
        where: { invoice: this.req.params.invoice }, // pastikan ini berdasarkan division_id
        include: [
          {
            required: true,
            model: Division,
            where: {
              company_id: this.company_id,
            },
          },
        ],
      }).then(async (e) => {
        if (e) {
          data = {
            id: e.id,
            invoice: e.invoice,
            dibayar_diterima: e.dibayar_diterima,
            petugas: e.petugas,
            status_kwitansi: e.status_kwitansi,
            tanggal_transaksi: moment(e.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            details: [],
          };
        }
      });
      // filter
      if (Object.keys(data).length > 0) {
        var details = [];
        await Jurnal.findAll({
          where: {
            source: "kaskeluarmasuk:invoice:" + this.req.params.invoice,
          },
        }).then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              details.push({
                ref: e.ref,
                ket: e.ket,
                akun_debet:
                  e.akun_debet + `<br><b>[${list_akun[e.akun_debet]}]</b>`,
                akun_kredit:
                  e.akun_kredit + `<br><b>[${list_akun[e.akun_kredit]}]</b>`,
                saldo: await convertToRP(e.saldo),
              });
            })
          );
        });

        data.details = details;
      }

      return data;
    } catch (error) {
      console.log("------XXX-----");
      console.log(error);
      console.log("------XXX-----");
      return {};
    }
  }

  async header_kwitansi_invoice() {
    var data = {};
    let division = null;
    await Division.findOne({
      attributes: ["name", "pos_code", "address"], // ambil dari Division
      where: { id: this.division_id }, // pastikan ini berdasarkan division_id
      include: [
        {
          required: true,
          model: Company,
          attributes: [
            "logo",
            "company_name",
            "email",
            "whatsapp_company_number",
            "invoice_logo",
            "invoice_title",
          ],
        },
        {
          model: Mst_kota, // include tabel mst_kota
          attributes: ["name"], // ambil kolom name dari mst_kota
        },
      ],
    }).then(async (e) => {
      if (e) {
        let exisFile = false;
        if (e.Company.invoice_logo !== null) {
          const filePath = path.join(
            __dirname,
            "uploads",
            e.Company.invoice_logo
          );
          if (fs.existsSync(filePath)) {
            exisFile = true;
          }
        }
        data["logo"] = exisFile ? e.Company.invoice_logo : "default.png";
        data["company_name"] = e.Company.company_name || "-";
        data["city"] = e.Mst_kota?.name || "-"; // ambil nama kota dari mst_kota
        data["address"] = e.address || "-";
        data["pos_code"] = e.pos_code || "-";
        data["email"] = e.Company.email || "-";
        data["whatsapp_company_number"] =
          e.Company.whatsapp_company_number || "-";
      }
    });

    if (division) {
      const invoiceLogo = division.Company?.invoice_logo;
      const logoPath = invoiceLogo
        ? path.resolve(__dirname, "../../../uploads", invoiceLogo)
        : null;
      const exists = invoiceLogo && fs.existsSync(logoPath);

      data.logo = exists ? invoiceLogo : "default.png";
      data.company_name = division.Company?.company_name ?? "-";
      data.city = division.Mst_kota?.name ?? "-";
      data.address = division.address ?? "-";
      data.pos_code = division.pos_code ?? "-";
      data.email = division.Company?.email ?? "-";
      data.whatsapp_company_number =
        division.Company?.whatsapp_company_number ?? "-";
    }

    console.log(data);
    return data;
  }

  async dataInvoiceDeposit() {
    await this.initialize();

    try {
      var data = { ...data, ...(await this.header_kwitansi_invoice()) };

      await Deposit.findOne({
        where: {
          division_id: this.division_id,
          invoice: this.req.params.invoice,
        },
        include: {
          required: true,
          model: Member,
          attributes: ["fullname"],
        },
      }).then(async (e) => {
        if (e) {
          data["invoice"] = e.invoice;
          data["nominal"] = e.nominal;
          data["createdAt"] = e.createdAt;
          data["penerima"] = e.penerima;
          data["info"] = e.info;
          data["tipe_transaksi"] = e.tipe_transaksi;
          data["fullname"] = e.Member.fullname;
          data["saldo_sesudah"] = e.saldo_sesudah;
        }
      });

      return data;
    } catch (error) {
      return {};
    }
  }

  async dataInvoicePaketLa() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      var data = { ...data, ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Fasilitas_paket_la.findOne({
        where: {
          invoice: this.req.params.invoice,
        },
      });

      if (!adaInvoice) {
        return {};
      }

      const sql = {
        attributes: ["client_name", "client_hp_number", "client_address"],
        where: {
          division_id: this.division_id,
        },
        include: {
          model: Fasilitas_paket_la,
          attributes: ["invoice", "total"],
          where: {
            invoice: this.req.params.invoice,
          },
          required: true,
          include: [
            {
              model: Detail_fasilitas_paket_la,
              attributes: [
                "description",
                "check_in",
                "check_out",
                "createdAt",
                "day",
                "pax",
                "price",
              ],
            },
          ],
        },
      };

      await Paket_la.findOne(sql).then(async (e) => {
        if (e) {
          data["client_name"] = e.client_name;
          data["client_hp_number"] = e.client_hp_number;
          data["client_address"] = e.client_address;
          data["order_date"] = myDate;
          data["invoice"] = e.Fasilitas_paket_las[0].invoice;
          data["total"] = e.Fasilitas_paket_las[0].total;
          data["detail_fasilitas"] = (
            e.Fasilitas_paket_las[0].Detail_fasilitas_paket_las || []
          ).map((detail) => ({
            description: detail.description,
            check_in: moment(detail.check_in).format("YYYY-MM-DD"),
            check_out: moment(detail.check_out).format("YYYY-MM-DD"),
            order_date: detail.createdAt,
            day: detail.day,
            pax: detail.pax,
            price: detail.price,
          }));
        }
      });

      console.log(data);

      return data;
    } catch (error) {
      return {};
    }
  }

  async dataKwitansiTerakhir() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      var data = { ...data, ...(await this.header_kwitansi_invoice()) };

      const adaRegNum = await Paket_la.findOne({
        where: {
          register_number: this.req.params.register_number,
        },
      });

      if (!adaRegNum) {
        return {};
      }

      const sql = {
        attributes: [
          "register_number",
          "client_name",
          "client_hp_number",
          "client_address",
          "createdAt",
        ],
        where: {
          division_id: this.division_id,
          register_number: this.req.params.register_number,
        },
        include: {
          model: Paket_la_transaction,
          attributes: ["status", "invoice", "paid", "createdAt", "receiver"],
          required: true,
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      };

      await Paket_la.findOne(sql).then(async (e) => {
        if (e) {
          data["register_number"] = e.register_number;
          data["client_name"] = e.client_name;
          data["Transaksi"] = (e.Paket_la_transactions || []).map(
            (transaction) => ({
              status: transaction.status,
              invoice: transaction.invoice,
              receiver: transaction.receiver,
              paid: transaction.paid,
              date: moment(transaction.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            })
          );
        }
      });

      console.log(data);

      return data;
    } catch (error) {
      return {};
    }
  }

  async dataKwitansiTabunganUmrah() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      var data = { ...data, ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Riwayat_tabungan.findOne({
        where: {
          invoice: this.req.params.invoice,
        },
      });

      if (!adaInvoice) {
        return {};
      }

      const sql = {
        attributes: [
          "invoice",
          "nominal_tabungan",
          "sumber_dana",
          "penerima",
          "saldo_tabungan_sebelum",
          "saldo_tabungan_sesudah",
          "info_tabungan",
          "createdAt",
        ],
        where: {
          invoice: this.req.params.invoice,
        },
        include: {
          model: Tabungan,
          attributes: ["createdAt"],
          include: [
            {
              model: Jamaah,
              include: [
                {
                  model: Member,
                  attributes: ["fullname", "whatsapp_number"],
                },
              ],
            },
          ],
        },
      };

      await Riwayat_tabungan.findOne(sql).then(async (e) => {
        if (e) {
          (data["invoice"] = e.invoice),
            (data["fullname"] = e.Tabungan.Jamaah.Member.fullname),
            (data["whatsapp_number"] =
              e.Tabungan.Jamaah.Member.whatsapp_number),
            (data["nominal_tabungan"] = e.nominal_tabungan),
            (data["sumber_dana"] = e.sumber_dana),
            (data["penerima"] = e.penerima),
            (data["saldo_tabungan_sebelum"] = e.saldo_tabungan_sebelum),
            (data["saldo_tabungan_sesudah"] = e.saldo_tabungan_sesudah),
            (data["info_tabungan"] = e.info_tabungan),
            (data["createdAt"] = e.createdAt);
        }
      });

      console.log(data);

      return data;
    } catch (error) {
      return {};
    }
  }

  async checkKwitansiTabunganUmrah() {
    try {
      const body = this.req.body;
      const adaData = await Riwayat_tabungan.findOne({
        where: { invoice: body.invoice },
      });
      return adaData ? { data: true } : { data: null };
    } catch (error) {
      console.error(error);
      throw {};
    }
  }

  async dataKwitansiHandoverFasilitas() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_fasilitas.findOne({
        where: { invoice: this.req.params.invoice },
      });

      if (!adaInvoice) {
        return {};
      }

      const hasil = await Handover_fasilitas.findOne({
        attributes: [
          "id",
          "invoice",
          "petugas",
          "penerima",
          "nomor_identitas_penerima",
          "createdAt",
        ],
        where: { invoice: this.req.params.invoice },
        include: [
          {
            model: Tabungan,
            include: [
              {
                model: Jamaah,
                include: [
                  {
                    model: Member,
                    attributes: ["fullname", "whatsapp_number"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!hasil) return {};

      // Basic info
      data.invoice = hasil.invoice;
      data.petugas = hasil.petugas;
      data.penerima = hasil.penerima;
      data.nomor_identitas_penerima = hasil.nomor_identitas_penerima;
      data.tanggal_transaksi = moment(hasil.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      // Detail fasilitas
      const details = await Handover_fasilitas_detail.findAll({
        where: { handover_fasilitas_id: hasil.id },
        raw: true,
      });

      if (!details || details.length === 0) {
        data.detail = [];
      } else {
        const fasilitasIds = details.map((d) => d.mst_fasilitas_id);

        const fasilitasList = await Mst_fasilitas.findAll({
          where: { id: { [Op.in]: fasilitasIds } },
          attributes: ["id", "name"],
          raw: true,
        });

        const fasilitasMap = fasilitasList.reduce((acc, f) => {
          acc[f.id] = f.name;
          return acc;
        }, {});

        data.detail = details.map((detail) => ({
          name: fasilitasMap[detail.mst_fasilitas_id] || "Tidak diketahui",
        }));
      }

      // Info jamaah
      const member = hasil?.Tabungan?.Jamaah?.Member;
      if (member) {
        data.fullname = member.fullname;
        data.whatsapp_number = member.whatsapp_number;
      }

      return data;
    } catch (error) {
      console.error("Error in dataKwitansiHandoverFasilitas:", error);
      throw error;
    }
  }

  async dataKwitansiHandoverBarang() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_barang.findOne({
        where: { invoice_handover: this.req.params.invoice },
      });

      if (!adaInvoice) {
        return {};
      }

      const handoverBarang = await Handover_barang.findAll({
        where: { invoice_handover: this.req.params.invoice },
        attributes: [
          "invoice_handover",
          "nama_barang",
          "giver_handover",
          "giver_handover_identity",
          "giver_handover_hp",
          "giver_handover_address",
          "receiver_handover",
          "date_taken",
        ],
        raw: true,
      });
      data.invoice_handover = handoverBarang[0].invoice_handover;
      data.handover_barang = handoverBarang.map((item) => item.nama_barang);
      data.giver_handover = handoverBarang[0].giver_handover;
      data.giver_handover_identity = handoverBarang[0].giver_handover_identity;
      data.giver_handover_hp = handoverBarang[0].giver_handover_hp;
      data.giver_handover_address = handoverBarang[0].giver_handover_address;
      data.receiver_handover = handoverBarang[0].receiver_handover;
      data.receiver_jabatan = (await tipe(this.req)).toUpperCase();
      data.date_taken = moment(handoverBarang[0].date_taken).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      return data;
    } catch (error) {
      console.log("Error in dataKwitansiHandoverBarang", error);
      throw error;
    }
  }

  async dataKwitansiPengembalianHandoverBarang() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_barang.findOne({
        where: { invoice_returned: this.req.params.invoice },
      });

      if (!adaInvoice) {
        return {};
      }

      const handoverBarang = await Handover_barang.findAll({
        where: { invoice_returned: this.req.params.invoice },
        attributes: [
          "invoice_returned",
          "nama_barang",
          "giver_returned",
          "receiver_returned",
          "receiver_returned_identity",
          "receiver_returned_hp",
          "receiver_returned_address",
          "date_returned",
        ],
        raw: true,
      });
      data.invoice_returned = handoverBarang[0].invoice_returned;
      data.handover_barang = handoverBarang.map((item) => item.nama_barang);
      data.giver_returned = handoverBarang[0].giver_returned;
      data.giver_jabatan = (await tipe(this.req)).toUpperCase();
      data.receiver_returned = handoverBarang[0].receiver_returned;
      data.receiver_returned_identity =
        handoverBarang[0].receiver_returned_identity;
      data.receiver_returned_hp = handoverBarang[0].receiver_returned_hp;
      data.receiver_returned_address =
        handoverBarang[0].receiver_returned_address;
      data.date_returned = moment(handoverBarang[0].date_returned).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      console.log(data);
      return data;
    } catch (error) {
      console.log("Error in dataKwitansiPengembalianHandoverBarang", error);
      throw error;
    }
  }

  async kwitansiPembayaranPerbulan() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      let data = await this.header_kwitansi_invoice();

      const adaInvoice = await Riwayat_pembayaran_peminjaman.findOne({
        where: {
          invoice: this.req.params.invoice,
        },
        include: {
          model: Peminjaman,
          required: true,
          attributes: [
            "id",
            "register_number",
            "nominal",
            "tenor",
            "status_peminjaman",
          ],
          include: {
            model: Jamaah,
            required: true,
            attributes: ["member_id"],
            include: {
              model: Member,
              required: true,
              attributes: ["fullname", "identity_number"],
            },
          },
        },
      });

      if (adaInvoice) {
        const pinjamanId = adaInvoice.Peminjaman.id;

        // Ambil semua cicilan sorted by createdAt
        const semuaCicilan = await Riwayat_pembayaran_peminjaman.findAll({
          where: {
            peminjaman_id: pinjamanId,
            status: "cicilan",
          },
          order: [["createdAt", "ASC"]], // Bisa juga pakai 'id' kalau lebih aman
        });

        // Cari index keberapa invoice ini muncul
        const termKe =
          semuaCicilan.findIndex(
            (item) => item.invoice === adaInvoice.invoice
          ) + 1;

        // Hitung total pembayaran
        const totalPembayaran = await Riwayat_pembayaran_peminjaman.sum(
          "nominal",
          {
            where: {
              peminjaman_id: pinjamanId,
            },
          }
        );

        const pinjaman = adaInvoice.Peminjaman;
        const jamaah = pinjaman?.Jamaah;
        const member = jamaah?.Member;

        // Ambil petugas dari Riwayat_pembayaran_peminjaman (misalnya 'petugas_name')
        const petugasName = adaInvoice.petugas_name || "Administrator"; // Fallback default

        data["invoice"] = adaInvoice.invoice;
        data["nominal"] = adaInvoice.nominal;
        data["status_pembayaran"] = adaInvoice.status;
        data["bulan"] = adaInvoice.bulan;
        data["tahun"] = adaInvoice.tahun;
        data["createdAt"] = moment(adaInvoice.createdAt).format("YYYY-MM-DD");
        data["tanggal_pembayaran"] = myDate;

        data["status_peminjaman"] = pinjaman.status_peminjaman;
        data["register_number"] = pinjaman.register_number;
        data["pinjaman_nominal"] = pinjaman.nominal;
        data["pinjaman_tenor"] = pinjaman.tenor;
        data["term"] = termKe;
        data["total_pembayaran"] = totalPembayaran || 0;

        if (member) {
          data["nama_jamaah"] = member.fullname;
          data["identity_number"] = member.identity_number;
        }

        // Tambahkan data petugas ke response
        data["nama_petugas"] = petugasName;
      }

      return data;
    } catch (error) {
      console.error("KWITANSI ERROR:", error);
      return {};
    }
  }

  async KwitansiVisa() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const transaksi = await Visa_transaction.findOne({
        where: {
          invoice: this.req.params.invoice,
          company_id: this.company_id,
        },
        include: [
          {
            // Include Level 1
            model: Visa_transaction_detail,
            required: true,
            include: [
              {
                model: Mst_visa_request_type,
                attributes: ["name"],
                required: false,
              },
            ],
          },
        ],
      });

      if (!transaksi) {
        return {};
      }

      const detailsArray = transaksi.Visa_transaction_details;
      if (!detailsArray || detailsArray.length === 0) {
        console.error(
          `[ERROR] Transaksi ${transaksi.invoice} ditemukan tetapi tidak memiliki detail.`
        );
        return {};
      }

      const detail = detailsArray[0];
      const jenisVisaName = detail.Mst_visa_request_type
        ? detail.Mst_visa_request_type.name
        : "Jenis Tidak Diketahui";

      data = {
        ...data,
        invoice: transaksi.invoice,
        petugas: transaksi.petugas,
        payer: transaksi.payer,
        payer_identity: transaksi.payer_identity,
        createdAt: transaksi.createdAt,

        name: detail.name,
        identity_number: detail.identity_number,
        birth_place: detail.birth_place,
        birth_date: detail.birth_date,
        passport_number: detail.passport_number,
        valid_until: detail.valid_until,
        price: detail.price,

        jenis_visa: jenisVisaName,

        profession_telephone: detail.profession_telephone,
      };
      return data;
    } catch (error) {
      console.error("Error in dataKwitansiVisa (with Jenis Visa):", error);
      return {};
    }
  }

  async invoice_pembayaran_fee_agen() {
    await this.initialize();
    try {
      const data = await this.header_kwitansi_invoice();

      const feeAgens = await Fee_agen.findAll({
        where: {
          invoice: this.req.params.invoice,
        },
        include: [
          {
            model: Pembayaran_fee_agen,
            required: true,
          },
          {
            model: Agen,
            required: true,
            include: {
              model: Member,
              required: true,
              attributes: ["fullname", "identity_number"],
            },
          },
        ],
      });

      if (!feeAgens || feeAgens.length === 0) {
        throw new Error("Data fee agen tidak ditemukan");
      }

      // Ambil info pembayaran dari fee pertama (karena 1 pembayaran aja)
      const pembayaran = feeAgens[0].Pembayaran_fee_agen;

      const data_invoice = feeAgens.map((item) => ({
        agen_name: item.Agen.Member.fullname,
        agen_identity: item.Agen.Member.identity_number,
        nominal_fee: item.nominal,
        info: item.info || "-",
      }));

      return {
        data_header: data,
        data_invoice,
        pembayaran: {
          invoice: pembayaran.invoice,
          tanggal_pembayaran: pembayaran.createdAt,
          penerima: pembayaran.penerima,
          nama_pemohon: pembayaran.applicant_name,
          identitas_pemohon: pembayaran.applicant_identity,
          nominal_pembayaran: pembayaran.nominal,
        },
      };
    } catch (error) {
      console.error("Gagal generate invoice pembayaran fee agen:", error);
      throw error;
    }
  }

  async dataKwitansiPembayaranTransaksiPaketUmrah() {
    await this.initialize();
    try {
      let data = await this.header_kwitansi_invoice();

      const paketTransactionHistory =
        await Paket_transaction_payment_history.findOne({
          order: [["createdAt", "DESC"]],
          where: {
            invoice: this.req.params.invoice,
          },
          include: [
            {
              model: Paket_transaction,
              required: true,
              include: [
                {
                  model: Mst_paket_type,
                  required: true,
                  attributes: ["name"],
                },
                {
                  model: Jamaah,
                  required: true,
                  include: {
                    model: Member,
                    required: true,
                    attributes: ["fullname", "whatsapp_number"],
                  },
                },
              ],
            },
          ],
        });

      data = {
        ...data,
        invoice: paketTransactionHistory.invoice,
        fullname:
          paketTransactionHistory.Paket_transaction.Jamaah.Member.fullname,
        whatsapp_number:
          paketTransactionHistory.Paket_transaction.Jamaah.Member
            .whatsapp_number,
        penerima: paketTransactionHistory.penerima,
        nominal: paketTransactionHistory.nominal,
        info_paket:
          "Pembelian Paket Tipe " +
          paketTransactionHistory.Paket_transaction.Mst_paket_type.name,
        createdAt: moment(paketTransactionHistory.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };

      return data;
    } catch (error) {
      console.error(
        "Error in dataKwitansiPembayaranTransaksiPaketUmrah:",
        error
      );
      return {};
    }
  }

  async invoice_trans_hotel() {
    await this.initialize();

    try {
      const invoice = this.req.params.invoice; // ⬅️ ambil dari params
      const header = await this.header_kwitansi_invoice();

      const transaksiList = await Hotel_transaction.findAll({
        where: {
          company_id: this.company_id,
          invoice: invoice,
        },
        include: [
          {
            model: Hotel_transaction_detail,
            required: true,
            attributes: [
              "name",
              "birth_date",
              "birth_place",
              "identity_number",
              "price",
              "check_in",
              "check_out",
            ],
            include: [
              {
                model: Mst_hotel,
                required: true,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      // Kalau invoice nggak ditemukan
      if (transaksiList.length === 0) {
        throw new Error(`Transaksi dengan invoice ${invoice} tidak ditemukan.`);
      }

      const data = transaksiList.map((trx) => {
        const detailList = trx.Hotel_transaction_details || [];

        const total_harga = detailList.reduce((sum, detail) => {
          return sum + Number(detail.price || 0);
        }, 0);

        return {
          id: trx.id,
          invoice: trx.invoice,
          payer: trx.payer,
          payer_identity: trx.payer_identity,
          petugas: trx.petugas,
          total_harga: total_harga,
          details: detailList.map((d) => ({
            name: d.name,
            birth_place: d.birth_place,
            birth_date: d.birth_date,
            identity_number: d.identity_number,
            price: d.price,
            check_in: d.check_in,
            check_out: d.check_out,
            hotel_name: d.Mst_hotel?.name ?? "-",
          })),
        };
      });

      return {
        header,
        data,
      };
    } catch (error) {
      console.error("❌ Gagal generate invoice hotel:", error.message);
      throw error;
    }
  }

  async KwitansiPassport() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const transaksi = await Passport_transaction.findOne({
        where: {
          invoice: this.req.params.invoice,
          company_id: this.company_id,
        },
        include: [
          {
            model: Passport_transaction_detail,
            required: true,
            include: [
              {
                model: Mst_kota,
                as: "Mst_kotum",
                attributes: ["name"],
                required: false,
              },
            ],
          },
        ],
      });

      if (!transaksi) {
        return {};
      }

      const detailsArray = transaksi.Passport_transaction_details;
      if (!detailsArray || detailsArray.length === 0) {
        console.error(
          `[ERROR] Transaksi ${transaksi.invoice} ditemukan tetapi tidak memiliki detail.`
        );
        return {};
      }

      // Memproses SEMUA detail, bukan hanya yang pertama
      const invoiceDetails = detailsArray.map((detail) => {
        return {
          name: detail.name,
          identity_number: detail.identity_number,
          birth_place: detail.birth_place,
          birth_date: detail.birth_date,
          kk_number: detail.kk_number,
          address: detail.address,
          price: detail.price,
          city: detail.Mst_kotum
            ? detail.Mst_kotum.name
            : "Kota Tidak Diketahui",
        };
      });

      // Menghitung total harga dari semua detail
      const totalPrice = detailsArray.reduce((sum, detail) => {
        return sum + Number(detail.price || 0);
      }, 0);

      data = {
        ...data,
        invoice: transaksi.invoice,
        petugas: transaksi.petugas,
        payer: transaksi.payer,
        payer_identity: transaksi.payer_identity,
        createdAt: transaksi.createdAt,
        details: invoiceDetails,
        total_price: totalPrice,
      };

      return data;
    } catch (error) {
      console.error("Error in dataKwitansiPassport", error);
      return {};
    }
  }

  async dataKwitansiHandoverFasilitasPaket() {
    await this.initialize();
    const myDate = moment(new Date()).format("DD MMMM YYYY");

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_fasilitas_paket.findOne({
        where: { invoice: this.req.params.invoice },
      });

      console.log(this.req.params);
      console.log("ini adaInvoive: ", adaInvoice);

      if (!adaInvoice) {
        return {};
      }

      const hasil = await Handover_fasilitas_paket.findOne({
        attributes: [
          "id",
          "invoice",
          "petugas",
          "penerima",
          "nomor_identitas_penerima",
          "createdAt",
        ],
        where: { invoice: this.req.params.invoice },
        include: [
          {
            model: Paket_transaction,
            include: [
              {
                model: Jamaah,
                include: [
                  {
                    model: Member,
                    attributes: ["fullname", "whatsapp_number"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!hasil) return {};

      // Basic info
      data.invoice = hasil.invoice;
      data.petugas = hasil.petugas;
      data.penerima = hasil.penerima;
      data.nomor_identitas_penerima = hasil.nomor_identitas_penerima;
      data.tanggal_transaksi = moment(hasil.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      // Detail fasilitas
      const details = await Handover_fasilitas_detail_paket.findAll({
        where: { handover_fasilitas_paket_id: hasil.id },
        raw: true,
      });

      if (!details || details.length === 0) {
        data.detail = [];
      } else {
        const fasilitasIds = details.map((d) => d.mst_fasilitas_id);

        const fasilitasList = await Mst_fasilitas.findAll({
          where: { id: { [Op.in]: fasilitasIds } },
          attributes: ["id", "name"],
          raw: true,
        });

        const fasilitasMap = fasilitasList.reduce((acc, f) => {
          acc[f.id] = f.name;
          return acc;
        }, {});

        data.detail = details.map((detail) => ({
          name: fasilitasMap[detail.mst_fasilitas_id] || "Tidak diketahui",
        }));
      }

      // Info jamaah
      const member = hasil?.Tabungan?.Jamaah?.Member;
      if (member) {
        data.fullname = member.fullname;
        data.whatsapp_number = member.whatsapp_number;
      }

      return data;
    } catch (error) {
      console.error("Error in dataKwitansiHandoverFasilitasPaket:", error);
      throw error;
    }
  }

  async dataKwitansiHandoverBarangPaket() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_barang_paket.findOne({
        where: { invoice_handover: this.req.params.invoice },
      });

      if (!adaInvoice) {
        return {};
      }

      const handoverBarang = await Handover_barang_paket.findAll({
        where: { invoice_handover: this.req.params.invoice },
        attributes: [
          "invoice_handover",
          "nama_barang",
          "giver_handover",
          "giver_handover_identity",
          "giver_handover_hp",
          "giver_handover_address",
          "receiver_handover",
          "date_taken",
        ],
        raw: true,
      });
      data.invoice_handover = handoverBarang[0].invoice_handover;
      data.handover_barang = handoverBarang.map((item) => item.nama_barang);
      data.giver_handover = handoverBarang[0].giver_handover;
      data.giver_handover_identity = handoverBarang[0].giver_handover_identity;
      data.giver_handover_hp = handoverBarang[0].giver_handover_hp;
      data.giver_handover_address = handoverBarang[0].giver_handover_address;
      data.receiver_handover = handoverBarang[0].receiver_handover;
      data.receiver_jabatan = (await tipe(this.req)).toUpperCase();
      data.date_taken = moment(handoverBarang[0].date_taken).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      return data;
    } catch (error) {
      console.log("Error in dataKwitansiHandoverBarangPaket", error);
      throw error;
    }
  }

  async dataKwitansiPengembalianHandoverBarangPaket() {
    await this.initialize();

    try {
      let data = { ...(await this.header_kwitansi_invoice()) };

      const adaInvoice = await Handover_barang_paket.findOne({
        where: { invoice_returned: this.req.params.invoice },
      });

      if (!adaInvoice) {
        return {};
      }

      const handoverBarang = await Handover_barang_paket.findAll({
        where: { invoice_returned: this.req.params.invoice },
        attributes: [
          "invoice_returned",
          "nama_barang",
          "giver_returned",
          "receiver_returned",
          "receiver_returned_identity",
          "receiver_returned_hp",
          "receiver_returned_address",
          "date_returned",
        ],
        raw: true,
      });
      data.invoice_returned = handoverBarang[0].invoice_returned;
      data.handover_barang = handoverBarang.map((item) => item.nama_barang);
      data.giver_returned = handoverBarang[0].giver_returned;
      data.giver_jabatan = (await tipe(this.req)).toUpperCase();
      data.receiver_returned = handoverBarang[0].receiver_returned;
      data.receiver_returned_identity =
        handoverBarang[0].receiver_returned_identity;
      data.receiver_returned_hp = handoverBarang[0].receiver_returned_hp;
      data.receiver_returned_address =
        handoverBarang[0].receiver_returned_address;
      data.date_returned = moment(handoverBarang[0].date_returned).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      console.log(data);
      return data;
    } catch (error) {
      console.log(
        "Error in dataKwitansiPengembalianHandoverBarangPaket",
        error
      );
      throw error;
    }
  }

  async invoice_trans_transport() {
    await this.initialize();

    try {
      const invoice = this.req.params.invoice;

      const header = await this.header_kwitansi_invoice();

      const transaksi = await Transport_transaction.findOne({
        where: {
          company_id: this.company_id,
          invoice: invoice,
        },
        include: [
          {
            model: Transport_transaction_detail,
            attributes: ["car_number", "price"],
            include: [
              {
                model: Mst_mobil,
                attributes: ["name"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!transaksi) {
        this.message = "Data transaksi tidak ditemukan.";
        this.state = false;
        return {
          status: false,
          message: this.message,
          data: null,
        };
      }

      const detail_mobil = transaksi.Transport_transaction_details.map((d) => ({
        car_number: d.car_number,
        price: d.price,
        nama_mobil: d.Mst_mobil?.name || "-",
      }));

      const total_price = detail_mobil.reduce(
        (sum, d) => sum + (d.price || 0),
        0
      );

      const data = {
        invoice: transaksi.invoice,
        payer: transaksi.payer,
        payer_identity: transaksi.payer_identity,
        petugas: transaksi.petugas,
        total_price,
        detail_mobil,
        header_kwitansi: header,
      };

      return {
        status: true,
        message: "Data invoice berhasil diambil.",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Gagal ambil data invoice transport.",
        data: null,
      };
    }
  }
}

module.exports = Model_r;
