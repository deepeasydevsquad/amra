"use strict";
const fs = require("fs");
const path = require("path");

const {
  Op,
  Company,
  Division,
  Kamar,
  Kamar_jamaah,
  Paket_transaction,
  Jamaah,
  Member,
  Mst_kota,
  Mst_hotel,
  Agen,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");

class model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    if (!this.company_id) {
      this.company_id = await getCompanyIdByCode(this.req);
    }
  }

  async getAllHotels() {
    await this.initialize();
    try {
      const hotels = await Mst_hotel.findAll({
        where: { company_id: this.company_id },
        order: [["name", "ASC"]],
      });

      const formattedHotels = await Promise.all(
        hotels.map(async (hotel) => {
          let cityName = "N/A";
          if (hotel.kota_id) {
            const kota = await Mst_kota.findOne({
              where: { id: hotel.kota_id },
              attributes: ["name"],
            });
            if (kota) {
              cityName = kota.name;
            }
          }
          return {
            id: hotel.id,
            name: hotel.name,
            kota_name: cityName,
          };
        })
      );

      return formattedHotels;
    } catch (error) {
      console.error("Error di getAllHotels:", error);
      throw error;
    }
  }

  async getAllAvailableJamaah() {
    await this.initialize();
    try {
      const assignedTransactions = await Kamar_jamaah.findAll({
        attributes: ["paket_transaction_id"],
      });
      const assignedTransactionIds = assignedTransactions.map(
        (item) => item.paket_transaction_id
      );

      const availableTransactions = await Paket_transaction.findAll({
        where: {
          id: { [Op.notIn]: assignedTransactionIds },
        },
        include: [
          {
            model: Jamaah,
            required: true,
            include: [{ model: Member, required: true }],
          },
        ],
      });

      return availableTransactions.map((t) => ({
        id: t.id,
        fullname: t.Jamaah.Member.fullname,
        identity_number: t.Jamaah.Member.identity_number,
      }));
    } catch (error) {
      console.error("Error di getAllAvailableJamaah:", error);
      throw error;
    }
  }

  async kamar_paket() {
    await this.initialize();

    const body = this.req.body;
    var limit = body.perpage;
    var page = 1;

    if (body.pageNumber != undefined && body.pageNumber !== "0")
      page = body.pageNumber;

    var where = { company_id: this.company_id };

    try {
      let kamarIds = [];

      if (body.search != undefined && body.search != "") {
        const searchTerm = body.search.toLowerCase();

        const matchingTransactions = await Paket_transaction.findAll({
          include: [
            {
              model: Jamaah,
              required: true,
              include: [
                {
                  model: Member,
                  required: true,
                  where: {
                    [Op.or]: [
                      { fullname: { [Op.like]: `%${searchTerm}%` } },
                      { identity_number: { [Op.like]: `%${searchTerm}%` } },
                    ],
                  },
                },
              ],
            },
          ],
        });

        const matchingTransactionIds = matchingTransactions.map((t) => t.id);

        if (matchingTransactionIds.length > 0) {
          const kamarJamaahs = await Kamar_jamaah.findAll({
            where: {
              paket_transaction_id: { [Op.in]: matchingTransactionIds },
            },
            attributes: ["kamar_id"],
          });

          kamarIds = [...new Set(kamarJamaahs.map((kj) => kj.kamar_id))];
        }

        if (kamarIds.length === 0) {
          where.id = { [Op.in]: [-1] };
        } else {
          where.id = { [Op.in]: kamarIds };
        }
      }

      var sql = {};
      sql["limit"] = limit * 1;
      sql["offset"] = (page - 1) * limit;
      sql["order"] = [["id", "ASC"]];
      sql["attributes"] = ["id", "tipe_kamar", "kapasitas_kamar", "hotel_id"];
      sql["where"] = where;

      const query = await dbList(sql);
      const q = await Kamar.findAndCountAll(query.total);
      const total = q.count;
      var data = [];

      if (total > 0) {
        await Kamar.findAll(query.sql).then(async (value) => {
          await Promise.all(
            await value.map(async (kamar) => {
              let hotelName = "N/A";
              let cityName = "N/A";

              const hotel = await Mst_hotel.findOne({
                where: { id: kamar.hotel_id },
              });

              if (hotel) {
                hotelName = hotel.name;
                if (hotel.kota_id) {
                  const kota = await Mst_kota.findOne({
                    where: { id: hotel.kota_id },
                  });
                  if (kota) {
                    cityName = kota.name;
                  }
                }
              }

              const kamarJamaahs = await Kamar_jamaah.findAll({
                where: { kamar_id: kamar.id },
                include: [
                  {
                    model: Paket_transaction,
                    include: [
                      {
                        model: Jamaah,
                        include: [{ model: Member }],
                      },
                    ],
                  },
                ],
              });

              const daftar_jamaah_murni = [];
              for (const kj of kamarJamaahs) {
                if (
                  kj.Paket_transaction &&
                  kj.Paket_transaction.Jamaah &&
                  kj.Paket_transaction.Jamaah.Member
                ) {
                  const memberId = kj.Paket_transaction.Jamaah.Member.id;
                  const isAgent = await Agen.findOne({
                    where: { member_id: memberId },
                  });
                  if (!isAgent) {
                    daftar_jamaah_murni.push({
                      nama: kj.Paket_transaction.Jamaah.Member.fullname,
                      no_identity:
                        kj.Paket_transaction.Jamaah.Member.identity_number,
                      tipe_paket: "Normal",
                    });
                  }
                }
              }

              const formatTipeKamar = (tipe) => {
                if (!tipe) return "";
                return tipe
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
                  .replace(/ /g, "-");
              };

              data.push({
                id: kamar.id,
                tipe_kamar: formatTipeKamar(kamar.tipe_kamar),
                hotel_name: hotelName,
                kapasitas_kamar: kamar.kapasitas_kamar,
                daftar_jamaah: daftar_jamaah_murni,
                nama_kota: cityName,
              });
            })
          );
        });
      }

      return {
        data: data,
        total: total,
      };
    } catch (error) {
      console.error("Error di kamar_paket:", error);
      return { data: [], total: 0 };
    }
  }

  async getAllJamaahForEdit(currentKamarId = null) {
    await this.initialize();
    try {
      let assignedToOtherRooms = [];

      if (currentKamarId) {
        const assignedTransactions = await Kamar_jamaah.findAll({
          where: {
            kamar_id: { [Op.ne]: currentKamarId },
          },
          attributes: ["paket_transaction_id"],
        });
        assignedToOtherRooms = assignedTransactions.map(
          (item) => item.paket_transaction_id
        );
      } else {
        const assignedTransactions = await Kamar_jamaah.findAll({
          attributes: ["paket_transaction_id"],
        });
        assignedToOtherRooms = assignedTransactions.map(
          (item) => item.paket_transaction_id
        );
      }

      let currentRoomJamaah = [];
      if (currentKamarId) {
        const currentAssignments = await Kamar_jamaah.findAll({
          where: { kamar_id: currentKamarId },
          attributes: ["paket_transaction_id"],
        });
        currentRoomJamaah = currentAssignments.map(
          (item) => item.paket_transaction_id
        );
      }

      const availableTransactionIds = [...currentRoomJamaah];

      const unassignedTransactions = await Paket_transaction.findAll({
        where: {
          id: { [Op.notIn]: assignedToOtherRooms },
        },
        attributes: ["id"],
      });

      availableTransactionIds.push(...unassignedTransactions.map((t) => t.id));

      const availableTransactions = await Paket_transaction.findAll({
        where: {
          id: { [Op.in]: availableTransactionIds },
        },
        include: [
          {
            model: Jamaah,
            required: true,
            include: [{ model: Member, required: true }],
          },
        ],
      });

      return availableTransactions.map((t) => ({
        id: t.id,
        fullname: t.Jamaah.Member.fullname,
        identity_number: t.Jamaah.Member.identity_number,
      }));
    } catch (error) {
      console.error("Error di getAllJamaahForEdit:", error);
      throw error;
    }
  }

  async get_kamar_by_id(id) {
    await this.initialize();
    try {
      const kamar = await Kamar.findByPk(id, {
        include: [
          {
            model: Kamar_jamaah,
            include: [{ model: Paket_transaction }],
          },
        ],
      });
      if (!kamar) throw new Error("Kamar tidak ditemukan");

      const formatTipeKamar = (tipe) => {
        if (!tipe) return "N/A";
        return tipe
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
          .replace(/ /g, "-");
      };

      const formattedData = {
        id: kamar.id,
        hotel_id: kamar.hotel_id,
        tipe_kamar: formatTipeKamar(kamar.tipe_kamar),
        kapasitas_kamar: kamar.kapasitas_kamar,
        jamaah_ids: kamar.Kamar_jamaahs.map((kj) => ({
          id: kj.Paket_transaction.id,
        })),
      };
      return formattedData;
    } catch (error) {
      console.error("Error di get_kamar_by_id:", error);
      throw error;
    }
  }

  async download_daftar_kamar() {
    await this.initialize();

    try {
      console.log(
        "Memulai download_daftar_kamar untuk company_id:",
        this.company_id
      );

      let companyInfo = null;
      try {
        const division = await Division.findOne({
          attributes: ["name", "pos_code", "address"],
          where: { company_id: this.company_id },
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
              model: Mst_kota,
              attributes: ["name"],
            },
          ],
        });

        if (division) {
          let exisFile = false;
          if (division.Company && division.Company.invoice_logo) {
            const filePath = path.join(
              __dirname,
              "../../../uploads",
              division.Company.invoice_logo
            );
            if (fs.existsSync(filePath)) {
              exisFile = true;
            }
          }

          companyInfo = {
            logo: exisFile ? division.Company.invoice_logo : "default.png",
            company_name: division.Company.company_name || "-",
            city: division.Mst_kota?.name || "-",
            address: division.address || "-",
            pos_code: division.pos_code || "-",
            email: division.Company.email || "-",
            whatsapp_company_number:
              division.Company.whatsapp_company_number || "-",
          };
        } else {
          console.warn(
            "Division tidak ditemukan untuk company_id:",
            this.company_id
          );

          const company = await Company.findByPk(this.company_id, {
            attributes: [
              "company_name",
              "address",
              "email",
              "whatsapp_company_number",
              "logo",
              "invoice_logo",
            ],
          });

          if (company) {
            companyInfo = {
              logo: company.invoice_logo || company.logo || "default.png",
              company_name: company.company_name || "-",
              city: "-",
              address: company.address || "-",
              pos_code: "-",
              email: company.email || "-",
              whatsapp_company_number: company.whatsapp_company_number || "-",
            };
          }
        }
      } catch (companyError) {
        console.error("Error mengambil data company:", companyError);
      }

      const allKamars = await Kamar.findAll({
        where: { company_id: this.company_id },
        order: [["id", "ASC"]],
      });

      console.log("Jumlah kamar ditemukan:", allKamars.length);

      const roomDetails = [];

      for (const kamar of allKamars) {
        try {
          let hotel = null;
          let kota = null;

          try {
            hotel = await Mst_hotel.findOne({ where: { id: kamar.hotel_id } });
            if (hotel && hotel.kota_id) {
              kota = await Mst_kota.findOne({ where: { id: hotel.kota_id } });
            }
          } catch (hotelError) {
            console.error(
              `Error mengambil data hotel untuk kamar ${kamar.id}:`,
              hotelError
            );
          }

          const kamarJamaahs = await Kamar_jamaah.findAll({
            where: { kamar_id: kamar.id },
            include: [
              {
                model: Paket_transaction,
                include: [{ model: Jamaah, include: [{ model: Member }] }],
              },
            ],
          });

          const daftar_jamaah_murni = [];
          for (const kj of kamarJamaahs) {
            try {
              if (kj.Paket_transaction?.Jamaah?.Member) {
                const isAgent = await Agen.findOne({
                  where: { member_id: kj.Paket_transaction.Jamaah.Member.id },
                });
                if (!isAgent) {
                  daftar_jamaah_murni.push({
                    nama: kj.Paket_transaction.Jamaah.Member.fullname,
                    no_identity:
                      kj.Paket_transaction.Jamaah.Member.identity_number,
                  });
                }
              }
            } catch (jamaahError) {
              console.error(
                `Error memproses jamaah untuk kamar ${kamar.id}:`,
                jamaahError
              );
            }
          }

          const formatTipeKamar = (tipe) => {
            if (!tipe) return "N/A";
            return tipe
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
              .replace(/ /g, "-");
          };

          roomDetails.push({
            tipe_kamar: formatTipeKamar(kamar.tipe_kamar),
            hotel_name: hotel ? hotel.name : "N/A",
            nama_kota: kota ? kota.name : "N/A",
            kapasitas_kamar: kamar.kapasitas_kamar || 0,
            jamaah: daftar_jamaah_murni,
          });
        } catch (kamarError) {
          console.error(`Error memproses kamar ${kamar.id}:`, kamarError);
          roomDetails.push({
            tipe_kamar: kamar.tipe_kamar || "N/A",
            hotel_name: "N/A",
            nama_kota: "N/A",
            kapasitas_kamar: kamar.kapasitas_kamar || 0,
            jamaah: [],
          });
        }
      }

      const result = {
        company: companyInfo || {
          logo: "default.png",
          company_name: "N/A",
          city: "N/A",
          address: "N/A",
          pos_code: "N/A",
          email: "N/A",
          whatsapp_company_number: "N/A",
        },
        rooms: roomDetails,
      };

      console.log("Download data berhasil dipersiapkan:", {
        companyName: result.company.company_name,
        roomCount: result.rooms.length,
      });

      return result;
    } catch (error) {
      console.error("Error di download_daftar_kamar:", error);
      throw new Error(`Gagal mempersiapkan data download: ${error.message}`);
    }
  }
}

module.exports = model_r;
