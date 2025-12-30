const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const {
  sequelize,
  Member,
  Division,
  Jamaah,
  Agen,
  User,
  Deposit,
  Mst_pekerjaan,
  Kelurahan,
  Mst_pendidikan,
} = require("../../../models");
const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const {
  getCompanyIdByCode,
  tipe,
  getCabang,
} = require("../../../helper/companyHelper");
const moment = require("moment");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { data } = require("jquery");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req);
    this.division_id = await getCabang(this.req);
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async getDivisionId() {
    const userType = await tipe(this.req);
    if (userType === "administrator") {
      return this.req.body.division_id;
    } else if (userType === "staff") {
      const decoded = jwt.decode(
        this.req.headers["authorization"]?.split(" ")[1]
      );
      return decoded?.division_id;
    } else {
      throw new Error("Role pengguna tidak valid.");
    }
  }

  async add() {
    // initialize dependensi properties
    await this.initialize();

    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const division_id = await this.getDivisionId();
      if (!division_id) throw new Error("division_id tidak ditemukan");

      // Ambil file foto dari request
      const photo = this.req.file ? this.req.file.path : null;

      // Enkripsi password menggunakan bcryptjs
      const salt = await bcrypt.genSalt(10); // Generate salt
      const hashedPassword = await bcrypt.hash(body.password, salt); // Hash password

      const insert = await Member.create(
        {
          division_id: division_id,
          fullname: body.fullname,
          identity_number: body.identity_number,
          identity_type: body.identity_type,
          gender: body.gender,
          birth_place: body.birth_place,
          birth_date: body.birth_date,
          whatsapp_number: body.whatsapp_number,
          password: hashedPassword, // Simpan password yang sudah dienkripsi
          photo: photo, // Simpan path foto ke database
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.message = `Menambahkan member baru: ${body.fullname} (ID: ${insert.id})`;
      await writeLog(this.req, this.t, { msg: this.message });

      await this.t.commit();
      return { success: true, message: this.message, data: insert };
    } catch (error) {
      await this.t.rollback();
      return { success: false, message: error.message };
    }
  }

  async update() {
    // initialize dependensi properties
    await this.initialize();

    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call model_r object
      const model = new Model_r(this.req);
      // Cari member berdasarkan ID
      const member = await model.infoMember(body.id); // Teruskan transaksi

      // Ambil file foto dari request, jika ada
      const photo = this.req.file ? this.req.file.path : member.photo;

      // Jika password diupdate, enkripsi password baru
      let hashedPassword = member.password; // Default: gunakan password lama

      // Siapkan data untuk diupdate
      const updateData = {
        fullname: body.fullname,
        identity_number: body.identity_number,
        identity_type: body.identity_type,
        gender: body.gender,
        birth_place: body.birth_place,
        birth_date: body.birth_date,
        whatsapp_number: body.whatsapp_number,
        updatedAt: myDate,
      };

      // check password
      if (body.password) {
        const salt = await bcrypt.genSalt(10); // Generate salt
        hashedPassword = await bcrypt.hash(body.password, salt); // Hash password baru
        updateData["password"] = hashedPassword;
      }

      // Hanya update foto jika ada file yang diupload
      if (this.req.file) {
        updateData.photo = photo;
      }

      // Update data berdasarkan id dan division_id
      await Member.update(updateData, {
        where: {
          id: body.id,
        },
        transaction: this.t,
      });
      // Log pesan update
      this.message = `Memperbarui Member ID ${body.id} (${member.fullname}) menjadi ${body.fullname}`;
    } catch (error) {
      this.state = false;
    }
  }

  // delete member
  async delete() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    try {
      // call model
      const model_r = new Model_r(this.req);
      const member = await model_r.infoMember(body.id);
      // destroy Member
      await Member.destroy({
        where: { id: body.id },
        include: {
          required: true,
          model: Division,
          where: {
            company_id: this.company_id,
          },
        },
        transaction: this.t,
      });
      this.message = `Menghapus Member ${member.fullname} (ID: ${member.id})`;
    } catch (error) {
      this.state = false;
    }
  }

  async makeAnAgen() {
    // initialize dependensi properties
    await this.initialize();
    const body = this.req.body;
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      // call model
      const model_r = new Model_r(this.req);
      const member = await model_r.infoMember(body.id);
      // insert agen
      await Agen.create(
        {
          member_id: this.req.body.id,
          level_keagenan_id: this.req.body.level,
          upline_id: this.req.body.upline != "0" ? this.req.body.upline : null,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.message = `Menjadikan Member ${member.fullname} (ID: ${member.id}) Menjadi Agen`;
    } catch (error) {
      console.log("-----xx-----");
      console.log(error);
      console.log("-----xx-----");
      this.state = false;
    }
  }

  async importExcel() {
    // initialize dependensi properties
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    async function get_kelurahan() {
      var list = [];
      await Kelurahan.findAll({}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            list.push(e.id);
          })
        );
      });
      return list;
    }

    async function get_pendidikan() {
      var list = {};
      await Mst_pendidikan.findAll({}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            list = { ...list, ...{ [e.name]: e.id } };
          })
        );
      });
      return list;
    }

    async function get_pekerjaan() {
      var list = {};
      await Mst_pekerjaan.findAll({}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            list = { ...list, ...{ [e.name]: e.id } };
          })
        );
      });
      return list;
    }

    async function get_member_info(company_id) {
      let nomor_identitas = [];
      let nomor_whatsapp = [];
      await Member.findAll({
        include: {
          model: Division,
          required: true,
          where: { company_id: company_id },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            nomor_identitas.push(e.identity_number);
            nomor_whatsapp.push(e.whatsapp_number);
          })
        );
      });
      return { nomor_identitas, nomor_whatsapp };
    }

    const parseYear = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const num = parseInt(String(value).trim());
      if (isNaN(num)) return null;
      // Jika nilainya 2 digit (misal 22 → 2022)
      if (num < 100 && num > 0) return 2000 + num;
      // Jika lebih kecil dari 1900 (tidak valid)
      if (num < 1900) return null;
      return num;
    };

    function parseExcelDate(value) {
      if (!value) return null;

      // Jika angka (serial Excel)
      if (typeof value === "number") {
        return moment("1899-12-30").add(value, "days").format("YYYY-MM-DD");
      }

      // Jika string tanggal
      const m = moment(value, "D/M/YYYY", true);

      return m.isValid() ? m.format("YYYY-MM-DD") : null;
    }

    try {
      // define list status nikah
      const list_status_nikah = ["menikah", "belum_menikah", "janda_duda"];
      // define list title
      const list_title = ["tuan", "nona", "nyonya"];
      // define list gender
      const list_gender = ["laki_laki", "perempuan"];
      // cari list nomor nik dari member dan nomor whatsapp
      const infos = await get_member_info(this.company_id);
      // get list kelurahan
      const list_kelurahan = await get_kelurahan();
      // get list pendidikan
      const list_pendidikan = await get_pendidikan();
      // get list pekerjaan
      const list_pekerjaan = await get_pekerjaan();
      // Path lengkap file yang diupload
      const filePath = path.join(
        __dirname,
        "../../../uploads/import_file",
        this.req.file.filename
      );
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      const headerRowIndex = 1; // baris kedua (karena baris pertama berisi catatan)
      const headers = sheetData[headerRowIndex];
      // Ambil data mulai baris setelah header
      const dataRows = sheetData.slice(headerRowIndex + 2);
      const salt = await bcrypt.genSalt(10); // Generate salt

      await Promise.all(
        dataRows.map(async (row) => {
          // data member
          let name_member = row[1];
          let nomor_identitas = row[2];
          let gender = list_gender.includes(String(row[3]).toLowerCase())
            ? String(row[3]).toLowerCase()
            : null;
          let tanggal_lahir = row[4];
          let tempat_lahir = row[5];
          let nomor_whatsapp = row[6];
          let password = await bcrypt.hash(String(row[7] || ""), salt);

          // data jamaah
          let kelurahan = list_kelurahan.includes(row[8]) ? row[8] : null;
          let alamat = row[9];
          let title = list_title.includes(String(row[10]).toLowerCase())
            ? String(row[10]).toLowerCase()
            : null;
          let nama_ayah = row[11];
          let nama_passport = row[12];
          let nomor_passport = row[13];
          let tanggal_dikeluarkan_passport = moment(row[14]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let tempat_di_keluarkan_passport = row[15];

          console.log("-------DDD");
          console.log(row[16]);
          console.log("-------DDD");
          let masa_berlaku_passport = parseExcelDate(row[16]);

          // moment(row[16]).format(
          //   "YYYY-MM-DD HH:mm:ss"
          // );

          let kode_pos = row[17];
          let nomor_telephone = row[18];
          let email = row[19];
          let pengalaman_haji = row[20];
          let tahun_haji = parseYear(row[21]);
          let pengalaman_umrah = row[22];
          let tahun_umrah = parseYear(row[23]);
          let penyakit = row[24];
          let pendidikanKey =
            row[25] && typeof row[25] === "string"
              ? row[25].toUpperCase()
              : String(row[25] || "").toUpperCase();
          let pendidikan_terakhir =
            list_pendidikan[pendidikanKey] === undefined
              ? null
              : list_pendidikan[pendidikanKey];
          let golongan_darah = row[26];
          let photo_4x6 =
            String(row[27] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let photo_3x4 =
            String(row[28] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let foto_copy_passport =
            String(row[29] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          const pekerjaanKey = String(row[30] || "")
            .trim()
            .toUpperCase();
          const pekerjaan =
            list_pekerjaan[pekerjaanKey] == undefined
              ? null
              : list_pekerjaan[pekerjaanKey];
          let nama_instansi = row[31];
          let alamat_instansi = row[32];
          let telepon_instansi = row[33];
          let foto_copy_kk =
            String(row[34] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let foto_copy_ktp =
            String(row[35] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let buku_nikah =
            String(row[36] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let akte_lahir =
            String(row[37] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let buku_kuning =
            String(row[38] || "").toLowerCase() === "ada" ? "ada" : "tidak_ada";
          let keterangan = row[39];
          let nama_keluarga = row[40];
          let alamat_keluarga = row[41];
          let telepon_keluarga = row[42];
          let status_nikah = list_status_nikah.includes(row[43])
            ? row[43]
            : "belum_menikah";
          let tanggal_menikah =
            row[44] == "" || row[44] == "0000-00-00"
              ? null
              : moment(row[44]).format("YYYY-MM-DD HH:mm:ss");
          let kewarganegaraan =
            String(row[45] || "")
              .trim()
              .toLowerCase() === "wni"
              ? "wni"
              : "wna";

          console.log("--------Importing member:");
          console.log(nomor_identitas);
          console.log(nomor_whatsapp);
          console.log(tanggal_menikah);
          console.log(row[44]);
          console.log("--------Importing member:");

          // filter
          if (
            nomor_identitas !== undefined &&
            nomor_whatsapp !== undefined &&
            !infos.nomor_identitas.includes(nomor_identitas.toString()) &&
            !infos.nomor_whatsapp.includes(nomor_whatsapp.toString())
          ) {
            // insert member
            const insertMember = await Member.create(
              {
                division_id: this.req.body.cabang_id,
                fullname: name_member,
                identity_number: nomor_identitas.toString(),
                identity_type: "ktp",
                gender: gender,
                birth_date: tanggal_lahir,
                birth_place: tempat_lahir,
                whatsapp_number: nomor_whatsapp,
                password: password,
                createdAt: myDate,
                updatedAt: myDate,
              },
              { transaction: this.t }
            );

            // insert jamaah
            await Jamaah.create(
              {
                division_id: this.req.body.cabang_id,
                agen_id: null,
                member_id: insertMember.id,
                kelurahan_id: kelurahan,
                address: alamat,
                title: title,
                nama_ayah: nama_ayah,
                nama_passport: nama_passport,
                nomor_passport: nomor_passport,
                tanggal_dikeluarkan_passport: tanggal_dikeluarkan_passport,
                tempat_di_keluarkan_passport: tempat_di_keluarkan_passport,
                masa_berlaku_passport: masa_berlaku_passport,
                kode_pos: kode_pos,
                nomor_telephone: nomor_telephone,
                email: email,
                pengalaman_haji: pengalaman_haji,
                tahun_haji: tahun_haji,
                pengalaman_umrah: pengalaman_umrah,
                tahun_umrah: tahun_umrah,
                desease: penyakit,
                last_education: pendidikan_terakhir,
                blood_type: golongan_darah,
                photo_4_6: photo_4x6,
                photo_3_4: photo_3x4,
                fc_passport: foto_copy_passport,
                mst_pekerjaan_id: pekerjaan,
                profession_instantion_name: nama_instansi,
                profession_instantion_address: alamat_instansi,
                profession_instantion_telephone: telepon_instansi,
                fc_kk: foto_copy_kk,
                fc_ktp: foto_copy_ktp,
                buku_nikah: buku_nikah,
                akte_lahir: akte_lahir,
                buku_kuning: buku_kuning,
                keterangan: keterangan,
                nama_keluarga: nama_keluarga,
                alamat_keluarga: alamat_keluarga,
                telephone_keluarga: telepon_keluarga,
                status_nikah: status_nikah,
                tanggal_nikah: tanggal_menikah,
                kewarganegaraan: kewarganegaraan,
                createdAt: myDate,
                updatedAt: myDate,
              },
              { transaction: this.t }
            );
          }
        })
        // await value.map(async (e) => {
        //   idAkunSecondary.push(e.id);
        // })
      );

      // this.message = `Menjadikan Member ${member.fullname} (ID: ${member.id}) Menjadi Agen`;
    } catch (error) {
      console.log("---------SSSS");
      console.log(error);
      console.log("---------SSSS");
      this.state = false;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
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
