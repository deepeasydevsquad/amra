const {
  sequelize,
  Jamaah,
  Member,
  Mahram,
  Division,
} = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.tipe = req;
    this.company_id = null;
    this.t = null;
    this.state = true;
    this.message = "";
    this.insertedDeposit = null;
    this.db = { Member, Jamaah, Mahram, Division };
  }

  async initialize() {
    this.company_id = await getCompanyIdByCode(this.tipe);
    this.t = await sequelize.transaction();
  }

  async getDivisionId() {
    const userType = await tipe(this.req);
    if (userType === "administrator") {
      return this.req.body.division_id;
    } else if (userType === "staff") {
      const token = this.req.headers["authorization"]?.split(" ")[1];
      const decoded = token ? jwt.decode(token) : null;
      return decoded?.division_id;
    } else {
      throw new Error("Role pengguna tidak valid.");
    }
  }

  async tambahJamaah() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    console.log("📥 Body:", body);

    const { MemberId, nama, alamat, mahram, ...jamaahData } = body;
    const division_id = await this.getDivisionId();

    let memberId;
    let hashedPassword = null;

    const photo = this.req?.file?.path ?? null;

    try {

      console.log('------>1');
      // Cek apakah MemberId dikirim atau tidak
      if (!MemberId) {
        console.log('------>2');
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(body.password, salt);

        const newMember = await Member.create(
          {
            division_id: division_id,
            fullname: body.fullname,
            identity_number: body.identity_number,
            identity_type: body.identity_type,
            gender: body.gender,
            birth_place: body.birth_place,
            birth_date: body.birth_date,
            whatsapp_number: body.whatsapp_number,
            password: hashedPassword,
            photo: photo,
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: this.t }
        );

        memberId = newMember.id;
      } else {
        console.log('------>3');
        memberId = MemberId;
      }

      console.log('------>4');
      const newJamaah = await Jamaah.create(
        {
          company_id: this.company_id,
          agen_id: jamaahData.agen_id == '0' ? null : jamaahData.agen_id,
          member_id: memberId,
          kelurahan_id: jamaahData.kelurahan_id,
          title: jamaahData.title,
          nama_ayah: jamaahData.nama_ayah,
          nama_passport: jamaahData.nama_passport,
          nomor_passport: jamaahData.nomor_passport,
          tanggal_di_keluarkan_passport: jamaahData.tanggal_di_keluarkan_passport,
          tempat_di_keluarkan_passport: jamaahData.tempat_di_keluarkan_passport,
          masa_berlaku_passport: jamaahData.masa_berlaku_passport,
          kode_pos: jamaahData.kode_pos,
          nomor_telephone: jamaahData.nomor_telephone,
          pengalaman_haji: jamaahData.pengalaman_haji,
          tahun_haji: jamaahData.tahun_haji,
          pengalaman_umrah: jamaahData.pengalaman_umrah,
          tahun_umrah: jamaahData.tahun_umrah,
          desease: jamaahData.desease,
          last_education: jamaahData.last_education,
          blood_type: jamaahData.blood_type,
          photo_4_6: jamaahData.photo_4_6,
          photo_3_4: jamaahData.photo_3_4,
          fc_passport: jamaahData.fc_passport,
          mst_pekerjaan_id: jamaahData.mst_pekerjaan_id,
          profession_instantion_name: jamaahData.profession_instantion_name,
          profession_instantion_address: jamaahData.profession_instantion_address,
          profession_instantion_telephone: jamaahData.profession_instantion_telephone,
          fc_kk: jamaahData.fc_kk,
          fc_ktp: jamaahData.fc_ktp,
          buku_nikah: jamaahData.buku_nikah,
          akte_lahir: jamaahData.akte_lahir,
          buku_kuning: jamaahData.buku_kuning,
          keterangan: jamaahData.keterangan,
          nama_keluarga: jamaahData.nama_keluarga,
          alamat_keluarga: jamaahData.alamat_keluarga,
          telephone_keluarga: jamaahData.telephone_keluarga,
          status_nikah: jamaahData.status_nikah,
          tanggal_nikah: jamaahData.tanggal_nikah,
          kewarganegaraan: jamaahData.kewarganegaraan,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      if (mahram) {
        await this.db.Mahram.create(
          {
            company_id: this.company_id,
            jamaah_id: newJamaah.id,
            mahram_id: mahram.mahram_id,
            mst_mahram_type_id: mahram.mst_mahram_type_id,
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: this.t }
        );
      }

      this.message = `Berhasil tambah jamaah dengan member_id ${memberId}`;
      this.state = true;
    } catch (error) {
      console.error("---- ERROR:");
      console.error(error);
      console.error("---- ERROR:");
      this.state = false;
      this.message = `Gagal tambah jamaah: ${error.message}`;
    }
  }

  async editJamaah() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    console.log("Data dari frontend:", this.req.body);

    const { id, mahram, ...jamaahData } = body;

    if (!id) {
      this.state = false;
      this.message = "ID member/jamaah wajib diisi untuk edit.";
      return;
    }

    const photo = this.req?.file?.path ?? null;

    try {
      // 1. Update data Member
      const existingMember = await this.db.Member.findByPk(id);
      if (!existingMember) {
        this.state = false;
        this.message = "Member tidak ditemukan.";
        return;
      }

      await existingMember.update(
        {
          fullname: body.fullname,
          identity_number: body.identity_number,
          identity_type: body.identity_type,
          gender: body.gender,
          birth_place: body.birth_place,
          birth_date: body.birth_date,
          whatsapp_number: body.whatsapp_number,
          photo: photo ?? existingMember.photo,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      // 2. Update data Jamaah
      const existingJamaah = await this.db.Jamaah.findOne({
        where: { member_id: id },
      });

      if (!existingJamaah) {
        this.state = false;
        this.message = "Jamaah tidak ditemukan.";
        return;
      }

      await existingJamaah.update(
        {
          ...jamaahData,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      // 3. Update atau Insert Mahram
      if (mahram) {
        const existingMahram = await this.db.Mahram.findOne({
          where: { jamaah_id: existingJamaah.id },
        });

        if (existingMahram) {
          await existingMahram.update(
            {
              mahram_id: mahram.mahram_id,
              mst_mahram_type_id: mahram.mst_mahram_type_id,
              updatedAt: myDate,
            },
            { transaction: this.t }
          );
        } else {
          await this.db.Mahram.create(
            {
              company_id: this.company_id,
              jamaah_id: existingJamaah.id,
              mahram_id: mahram.mahram_id,
              mst_mahram_type_id: mahram.mst_mahram_type_id,
              createdAt: myDate,
              updatedAt: myDate,
            },
            { transaction: this.t }
          );
        }
      }

      this.state = true;
      this.message = `Berhasil update jamaah & member dengan ID ${id}`;
    } catch (error) {
      console.error("❌ ERROR EDIT FULL:", error);
      this.state = false;
      this.message = `Gagal edit jamaah: ${error.message}`;
    }
  }

  async deleteJamaah() {
    await this.initialize(); // Inisialisasi transaksi dan company_id
    const { member_id } = this.req.body;

    try {
      console.log("🔍 Mencari Jamaah dengan member_id:", member_id);

      // Cari data jamaah berdasarkan member_id
      const jamaah = await this.db.Jamaah.findOne({
        where: { member_id },
        transaction: this.t,
      });

      if (!jamaah) {
        this.state = false;
        this.message = "Jamaah tidak ditemukan.";
        return;
      }

      const jamaahId = jamaah.id;

      // Hapus Mahram yang terkait
      await this.db.Mahram.destroy({
        where: { jamaah_id: jamaahId },
        transaction: this.t,
      });

      // Hapus Jamaah
      await this.db.Jamaah.destroy({
        where: { member_id },
        transaction: this.t,
      });


      this.state = true;
      this.message = `✅ Berhasil hapus jamaah dan member dengan member_id ${member_id}`;
    } catch (error) {
      await this.t.rollback();
      console.error("❌ ERROR:", error);

      this.state = false;
      this.message = `Gagal hapus jamaah: ${error.message}`;
    }
  }


  async response() {
    if (this.state) {
      console.log("✅ COMMITING TRANSACTION...");
      try {
        await writeLog(this.req, this.t, { msg: this.message });
        await this.t.commit();
        console.log("✅ TRANSACTION COMMITTED");
      } catch (e) {
        console.error("❌ ERROR WAKTU COMMIT:", e);
        this.t.rollback();
      }
      return true;
    } else {
      console.log("🔁 ROLLING BACK TRANSACTION:", this.message);
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
