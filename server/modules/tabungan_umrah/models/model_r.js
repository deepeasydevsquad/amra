const {
  Op,
  Paket,
  Paket_price,
  Tabungan,
  Jamaah,
  Riwayat_tabungan,
  Agen,
  Level_keagenan,
  Fee_agen,
  Member,
  Handover_fasilitas,
  Handover_fasilitas_detail,
  Deposit,
  Jurnal,
  Mst_fasilitas,
} = require("../../../models");
const { getCompanyIdByCode, getCabang } = require("../../../helper/companyHelper");
const { getAgenById } = require("../../../helper/JamaahHelper");
const { dbList } = require("../../../helper/dbHelper");
const moment = require("moment");
  
class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.division_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
  }

  // Fungsi bantu untuk ambil ID jamaah dari pencarian
  async getJamaahIdsFromSearch(searchTerm) {
    const jamaahIds = await Jamaah.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: [
          { '$Member.fullname$': { [Op.like]: `%${searchTerm}%` } },
          { '$Member.identity_number$': { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [{ model: Member }],
      raw: true,
    });

    return jamaahIds.map((j) => j.id);
  }

    // Mengambil data paket
  async getPaketNameById(id) {
    const paket = await Paket.findOne({ where: { id }, attributes: ["name"] });
    return paket?.name || "-";
  }

  // Mengambil data agen
  async getAgenDetailById(fee_agen_id) {
    if (!fee_agen_id) return { fullname: "-", level: "-", default_fee: "-" };

    const agen = await getAgenById(fee_agen_id);
    return {
      fullname: agen?.Member?.fullname || "-",
      level: agen?.Level_keagenan?.name || "-",
      default_fee: agen?.Level_keagenan?.default_fee || "-",
    };
  }

  // Ambil riwayat tabungan
  async getRiwayatTabungan(tabungan_id) {
    const list = await Riwayat_tabungan.findAll({
      where: { tabungan_id },
      order: [["id", "ASC"]],
    });

    return list.map((r) => ({
      id: r.id,
      invoice: r.invoice,
      nominal_tabungan: r.nominal_tabungan,
      transaksi: moment(r.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      penerima: r.penerima
    }));
  }

  // Ambil semua mst_fasilitas berdasarkan array handover_fasilitas_id
  async getMstFasilitasByHandoverIds(handoverIds) {
    if (!Array.isArray(handoverIds)) {
      handoverIds = [handoverIds];
    }
    if (handoverIds.length === 0) return [];
    const fasilitasList = await Handover_fasilitas_detail.findAll({
      where: {
        handover_fasilitas_id: { [Op.in]: handoverIds },
      },
      include: [{
        model: Mst_fasilitas,
        attributes: ["id", "name"],
      }]
    });

    // Ambil hanya id dan name fasilitas
    const fasilitas = fasilitasList
      .map(fd => ({ id: fd.Mst_fasilita?.id, name: fd.Mst_fasilita?.name }))
      .filter(f => !!f.id && !!f.name && f.name !== "-") // Filter jika id atau name kosong
      .sort((a, b) => a.name.localeCompare(b.name));

    const hasil = [...new Set(fasilitas.map(JSON.stringify))].map(JSON.parse);
    return hasil;
  }

  // Ambil riwayat handover fasilitas
  async getRiwayatHandover(tabungan_id) {
    const handovers = await Handover_fasilitas.findAll({
      where: { tabungan_id },
      order: [["id", "ASC"]],
    });

    const handoverIds = handovers.map(h => h.id);
    const namaFasilitas = await this.getMstFasilitasByHandoverIds(handoverIds);
    return namaFasilitas;
  }

  // Fungsi utama
  async transformTabunganItem(e) {
    const member = e.Jamaah?.Member || {};
    return {
      id: e.id,
      member: {
        fullname: member.fullname || "-",
        identity_number: member.identity_number || "-",
        birth_place: member.birth_place || "-",
        birth_date: member.birth_date
          ? moment(member.birth_date).format('DD MMMM YYYY')
          : "-",
      },
      target_paket_name: await this.getPaketNameById(e.target_paket_id),
      target_paket_id: e.target_paket_id || null,
      total_tabungan: e.total_tabungan,
      status: e.status,
      fee_agen_id: e.fee_agen_id || "-",
      agen: await this.getAgenDetailById(e.fee_agen_id),
      batal_berangkat: e.batal_berangkat === "ya",
      paket_transaction_id: e.paket_transaction_id,
      sisa_pembelian: e.sisa_pembelian,
      invoice_sisa_deposit: e.invoice_sisa_deposit,
      riwayat_tabungan: await this.getRiwayatTabungan(e.id),
      riwayat_handover_fasilitas: await this.getRiwayatHandover(e.id),
      createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  async daftar_tabungan_umrah() {
    await this.initialize();

    const body = this.req.body;
    const pageNumber = parseInt(body.pageNumber) || 1;
    const perpage = parseInt(body.perpage) || 10;
    const offset = (pageNumber - 1) * perpage;
    const search = body.search || "";
    const filter = body.filter || "belum_beli_paket";

    let where = { division_id: this.division_id };

    if (filter === "belum_beli_paket") {
      where = { ...where, paket_transaction_id: null, batal_berangkat: "tidak" };
    } else if (filter === "sudah_beli_paket") {
      where = { ...where, paket_transaction_id: { [Op.not]: null }, batal_berangkat: "tidak" };
    } else if (filter === "batal_berangkat") {
      where = { ...where, batal_berangkat: "ya" };
    }

    if (search) {
      const jamaahIds = await this.getJamaahIdsFromSearch(search);
      where = { ...where, jamaah_id: { [Op.in]: jamaahIds } };
    }

    const sql = {
      where,
      attributes: [
        "id", "target_paket_id", "total_tabungan", "status", "fee_agen_id",
        "batal_berangkat", "paket_transaction_id", "sisa_pembelian", 
        "invoice_sisa_deposit", "createdAt", "updatedAt"
      ],
      include: [{
        model: Jamaah,
        required: true,
        include: [{
          model: Member,
          attributes: ["fullname", "identity_number", "birth_place", "birth_date"],
          required: false
        }]
      }],
      order: [["id", "ASC"]],
      offset,
      limit: perpage,
    };

    try {
      const totalData = await Tabungan.count({ where });
      const dataList = await Tabungan.findAll(sql);
      const data = await Promise.all(dataList.map((item) => this.transformTabunganItem(item)));

      return {
        data,
        total: totalData,
      };
    } catch (error) {
      console.error("Error in daftar_tabungan_umrah:", error);
      return {};
    }
  }


  async getJamaahTabunganUmrah () {
    try {
      await this.initialize();

      const jamaah = await Jamaah.findAll({
        where: {
          division_id: this.division_id,
        },
        attributes: ["id", "agen_id"],
        include: [{
          model: Member,
          attributes: ["fullname"],
        }],
      });

      return {
        data: jamaah.map(e => ({
          id: e.id,
          agen_id: e.agen_id,
          name: e.Member.fullname
        })),
        total: jamaah.length,
      };

    } catch (error) {
      console.error("Error in getJamaahTabunganUmrah:", error);
      return {};
    }
  }
  async getPaketTabunganUmrah () {
    try {
      await this.initialize();
      var data = {};
      const paket = await Paket.findAll({
        where: {
          division_id: this.division_id,
          departure_date: {
            [Op.gte]: moment().format('YYYY-MM-DD'),
          },
        },
        attributes: ["id", "name", "departure_date"],
      });

      const paketPrices = await Paket_price.findAll({
        where: {
          paket_id: {
            [Op.in]: paket.map(e => e.id),
          },
        },
        attributes: ["paket_id", "price"],
      });

      if (paket) {
        data["data"] = paket.map(e => {
          const hargaSemua = paketPrices
            .filter(p => p.paket_id === e.id)
            .reduce((total, current) => total + Number(current.price), 0)

          return {
            id: e.id,
            name: e.name,
            price: hargaSemua,
            hari_tersisa: moment(e.departure_date).diff(moment(), 'days'),
          }
        });
      }

      return data;

    } catch (error) {
      console.error("Error in getPaketTabunganUmrah:", error);
      return {};
    }
  }

  async getAgenById () {
    try {
      await this.initialize();
      const body = this.req.body;
      console.log(body);
      var data = {};
      const agen = await Agen.findOne({
        where: {
          id: body.id,
        },
        attributes: ["id"],
        include: [
          {
            model: Member,
            attributes: ["fullname"],
          },
          {
            model: Level_keagenan,
            attributes: ["default_fee"],
          }
        ],
      });

      if (agen) {
        data["data"] = {
          id: agen.id,
          name: agen.Member.fullname,
          default_fee: Number(agen.Level_keagenan.default_fee)
        };
      }

      return data;

    } catch (error) {
      console.error("Error in getAgenById:", error);
      return {};
    }
  }

  async getHandoverFasilitasById() {
    try {
      await this.initialize();
      const body = this.req.body;
      const tabunganId = body.id;
      
      const handoverFasilitas = await Handover_fasilitas.findAll({
        where: { tabungan_id: tabunganId },
        order: [["id", "ASC"]],
        include: [
          {
            model: Handover_fasilitas_detail,
            include: [Mst_fasilitas],
          },
        ],
      });

      if (handoverFasilitas) {
        const data = handoverFasilitas.map(hf => ({
          id: hf.id,
          invoice: hf.invoice,
          petugas: hf.petugas,
          penerima: hf.penerima,
          nomor_identitas_penerima: hf.nomor_identitas_penerima,
          tgl_penerima: moment(hf.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          detail: hf.Handover_fasilitas_details.map(fd => ({
            id: fd.Mst_fasilita?.id || null,
            name: fd.Mst_fasilita?.name || "-",
          })),
        }));

        return {
          data : data,
          total: handoverFasilitas.length,
        };
      }
      
    } catch (error) {
      console.error("Error in get_handover_fasilitas_by_tabungan_id:", error);
      return {};
    }
  }

  async getMstFasilitas() {
    try {
      await this.initialize();
      const { id: tabungan_id } = this.req.body;
      let data = [];

      // Ambil data tabungan dan pastikan target_paket_id ada
      const tabungan = await Tabungan.findByPk(tabungan_id);
      if (!tabungan?.target_paket_id) return { data: {error: true, err_msg: "Tabungan tidak memiliki target paket"}, total: 0 };

      // Ambil daftar fasilitas dari paket (JSON)
      const paket = await Paket.findByPk(tabungan.target_paket_id, { attributes: ["facilities"] });
      const fasilitasIds = JSON.parse(paket?.facilities || "[]").map(f => +f.id);

      // Ambil id fasilitas yang sudah digunakan
      const handoverIds = await Handover_fasilitas.findAll({
        attributes: ["id"],
        where: { tabungan_id },
        raw: true,
      }).then(rows => rows.map(r => r.id));

      const usedIds = await Handover_fasilitas_detail.findAll({
        attributes: ["mst_fasilitas_id"],
        where: {
          handover_fasilitas_id: { [Op.in]: handoverIds.length ? handoverIds : [0] },
        },
        raw: true,
      }).then(rows => rows.map(r => r.mst_fasilitas_id));

      // Filter fasilitas yang belum digunakan
      const unusedIds = fasilitasIds.filter(id => !usedIds.includes(id));

      // Ambil nama fasilitas yang tersedia
      const fasilitas = await Mst_fasilitas.findAll({
        where: {
          id: { [Op.in]: unusedIds.length ? unusedIds : [0] },
          company_id: this.company_id,
        },
        order: [["name", "ASC"]],
        raw: true,
      });

      data = fasilitas.map(f => ({ id: f.id, name: f.name }));

      return {
        data,
        total: data.length,
      };

    } catch (error) {
      console.error("Error in getMstFasilitas:", error);
      return { data: {error: true, err_msg: "Fasilitas tidak ditemukan"}, total: 0 };
    }
  }

  async infoTabungan(id) {
    try {
      const tabungan = await Tabungan.findOne({
        where: { id: id },
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "total_tabungan",
          "jamaah_id",
          "status",
          "fee_agen_id",
          "paket_transaction_id",
          "batal_berangkat",
          "sisa_pembelian",
          "invoice_sisa_deposit",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Jamaah,
            required: true,
            include: [
              {
                model: Member,
                attributes: [
                  "id",
                  "fullname",
                  "identity_number",
                  "birth_place",
                  "birth_date",
                ],
                required: false,
              },
            ],
          },
        ],
      });

      if (!tabungan) return {};

      const data = {
        id: tabungan.id,
        status: tabungan.status,
        total_tabungan: tabungan.total_tabungan,
        jamaah_id: tabungan.jamaah_id,
        fee_agen_id: tabungan.fee_agen_id,
        batal_berangkat: tabungan.batal_berangkat,
        paket_transaction_id: tabungan.paket_transaction_id,
        sisa_pembelian: tabungan.sisa_pembelian,
        invoice_sisa_deposit: tabungan.invoice_sisa_deposit,
        createdAt: tabungan.createdAt,
        updatedAt: tabungan.updatedAt,
      };

      if (tabungan.Jamaah && tabungan.Jamaah.Member) {
        const member = tabungan.Jamaah.Member;
        data.jamaah = {
          id: member.id,
          fullname: member.fullname,
          identity_number: member.identity_number,
          birth_place: member.birth_place,
          birth_date: member.birth_date,
        };
      }

      return data;
    } catch (error) {
      console.error("Error in infoTabungan:", error);
      return {};
    }
  }
}

module.exports = Model_r;
