const {
  Op,
  Provinsi,
  Kabupaten_kota,
  Kecamatan,
  Kelurahan,
  Mst_mahram_type,
  Mst_pekerjaan,
  Mst_pendidikan,
  Mst_kota,
  Mst_provider,
  Mst_paket_type,
  Mst_asuransi,
  Mst_airline,
  Mst_airport,
  Mst_hotel,
  Mst_fasilitas,
  Pengalaman_haji_umrah,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { dbList } = require("../../../helper/dbHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
  }

  async daftar_provinsi() {
    const body = this.req.body;
    let limit = body.perpage || 34; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Provinsi tanpa filter pencarian
      const result = await Provinsi.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async daftar_kabupaten() {
    const body = this.req.body;
    let limit = body.perpage || 9999999999999999; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "provinsi_id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Kabupaten_kota.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        provinsi_id: e.provinsi_id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async daftar_kecamatan() {
    const body = this.req.body;
    let limit = body.perpage || 999999999; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided
    let kabupaten_id = body.kabupaten_id; // Menangkap kabupaten_id dari body request

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "kabupaten_kota_id", "name"],
      where: {},
    };

    // Jika kabupaten_id ada, tambahkan filter pada where
    if (kabupaten_id) {
      sql.where.kabupaten_kota_id = kabupaten_id;
    }

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Kecamatan.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        kabupaten_kota_id: e.kabupaten_kota_id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async daftar_kelurahan() {
    const body = this.req.body;
    let limit = body.perpage || 10; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided
    let kecamatan_id = body.kecamatan_id;

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "kecamatan_id", "name"],
      where:{},
    };

    if (kecamatan_id) {
      sql.where.kecamatan_id = kecamatan_id;
    }

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Kelurahan.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        kecamatan_id: e.kecamatan_id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async daftar_mahram() {
    const body = this.req.body;
    let limit = body.perpage || 10; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Mst_mahram_type.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async daftar_pekerjaan() {
    const body = this.req.body;
    let limit = body.perpage || 10; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Mst_pekerjaan.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }
  async daftar_pendidikan() {
    const body = this.req.body;
    let limit = body.perpage || 10; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Mst_pendidikan.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }
  async daftar_haji_umrah() {
    const body = this.req.body;
    let limit = body.perpage || 10; // Set default perpage if not provided
    let page = body.pageNumber || 1; // Set default page if not provided

    const sql = {
      limit: limit * 1,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "name"],
    };

    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Kabupaten tanpa filter pencarian
      const result = await Pengalaman_haji_umrah.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getKota() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {

      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Provider tanpa filter pencarian
      const result = await Mst_kota.findAndCountAll(query.sql);
      const total = result.count;

      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));

      // Return data dan total
      return { data, total };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getProviderVisa() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil data dari Provider tanpa filter pencarian
      const result = await Mst_provider.findAndCountAll(sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      console.log("getProviderVisa: ", data);
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getTipePaket() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Paket Type tanpa filter pencarian
      const result = await Mst_paket_type.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getAsuransi() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Asuransi tanpa filter pencarian
      const result = await Mst_asuransi.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getAirlines() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Airlines tanpa filter pencarian
      const result = await Mst_airline.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getBandara() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Airport tanpa filter pencarian
      const result = await Mst_airport.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getHotel() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Hotel tanpa filter pencarian
      const result = await Mst_hotel.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

  async getFasilitas() {
    await this.initialize();
    const sql = {
      where: { company_id: this.company_id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    };
    try {
      // Mengambil query dari dbList
      const query = await dbList(sql);
      console.log(query); // Debugging query

      // Mengambil data dari Facilities tanpa filter pencarian
      const result = await Mst_fasilitas.findAndCountAll(query.sql);
      const total = result.count;
      // Map data hasil
      const data = result.rows.map((e) => ({
        id: e.id,
        name: e.name,
      }));
      console.log("getFasilitas: ", data);
      // Return data dan total
      return { 
        data: data, 
        total: total
      };
    } catch (error) {
      console.error(error); // Debugging error
      return {};
    }
  }

}

module.exports = Model_r;
