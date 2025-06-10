const { sequelize, Visa_transaction, Visa_transaction_detail, Company, Member, Mst_visa_request_type } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const { getCompanyIdByCode, tipe } = require("../../../helper/companyHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
    this.t; // transaction
    this.state = true; // status operasi
    this.message = ""; // pesan untuk log dan respons
  }

  
  //Menginisialisasi transaksi database dan mengambil company_id dari token.
  
  async initialize() {
    this.company_id = await getCompanyIdByCode(this.req); //
    this.t = await sequelize.transaction(); //
    this.state = true; //
  }

  //Menentukan nama petugas berdasarkan role dari token JWT.
  async petugas() {
    console.log("DEBUG [petugas]: Memulai fungsi petugas...");
    
    const role = await tipe(this.req); //
    console.log("DEBUG [petugas]: Role/Tipe yang didapat dari helper =>", role);

    console.log("DEBUG [petugas]: Company ID yang digunakan =>", this.company_id);
    if (!this.company_id) {
      console.error("DEBUG [petugas]: GAGAL KARENA company_id KOSONG!");
      return "Error: Company ID tidak ditemukan";
    }

    if (role === "administrator") {
      console.log("DEBUG [petugas]: Mencari data company sebagai administrator...");
      const company = await Company.findOne({ where: { id: this.company_id } }); //
      console.log("DEBUG [petugas]: Hasil pencarian company =>", company ? company.toJSON() : null);
      return company?.company_name ?? "Unknown Company"; //
    }

    if (role === "staff") {
      console.log("DEBUG [petugas]: Mencari data member sebagai staff...");
      const member = await Member.findOne({
        where: { company_id: this.company_id, role: "staff" }, //
        order: [["id", "DESC"]], //
      });
      console.log("DEBUG [petugas]: Hasil pencarian member =>", member ? member.toJSON() : null);
      return member?.fullname ?? "Unknown Staff"; //
    }

    console.log("DEBUG [petugas]: Role tidak dikenali, mengembalikan nilai default.");
    return "Tipe user tidak diketahui"; //
  }

 //Mencari atau membuat data jenis visa di tabel mst_visa_request_type

async findOrCreateVisaType(visaType) {
  try {
    let visaRequestType = await Mst_visa_request_type.findOne({
      where: { 
        name: visaType,
      }
    });
    if (!visaRequestType) {
      visaRequestType = await Mst_visa_request_type.create({
        name: visaType,
        createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      }, { transaction: this.t });
    }

    return visaRequestType.id;
  } catch (error) {
    console.error("Error di findOrCreateVisaType:", error);
    throw error;
  }
}

  //Menambahkan data transaksi visa baru ke database.
  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const namaPetugas = await this.petugas();
      if (namaPetugas.startsWith("Error:") || namaPetugas.includes("Unknown")) {
         throw new Error(`Gagal menentukan petugas yang valid. Diterima: ${namaPetugas}`);
      }
      
      const newTransaction = await Visa_transaction.create({
          invoice: body.invoice,
          company_id: this.company_id,
          petugas: namaPetugas,
          payer: body.payer,
          payer_identity: body.payer_identity,
          createdAt: myDate,
          updatedAt: myDate,
        }, { transaction: this.t });

      const newTransactionId = newTransaction.id;


      const visaTypeId = await this.findOrCreateVisaType(body.jenis_visa);
      await Visa_transaction_detail.create({
          visa_transaction_id: newTransactionId,
          mst_visa_request_type_id: visaTypeId, 
          name: body.name,
          identity_number: body.identity_number,
          gender: body.gender ? body.gender.toLowerCase().replace("-", "_") : null,
          birth_place: body.birth_place,
          birth_date: body.birth_date,
          citizenship: body.nationality,
          passport_number: body.passport_number,
          date_issued: body.passport_issued_date,
          place_of_release: body.passport_issued_place,
          valid_until: body.valid_until,
          profession_idn: body.indonesia_job,
          profession_foreign: body.abroad_job,
          profession_address: body.work_address,
          pofession_pos_code: body.postal_code,
          profession_city: body.city,
          profession_country: body.origin_country,
          profession_telephone: body.phone,
          price: body.price,
          createdAt: myDate,
          updatedAt: myDate,
        }, { transaction: this.t });

      this.message = `Menambahkan Transaksi Visa Baru untuk : ${body.payer} dengan ID Transaksi : ${newTransactionId} oleh petugas: ${namaPetugas}`;

    } catch (error) {
      console.error("Error di model CUD add:", error);
      this.state = false;
      this.message = `Gagal menambahkan transaksi: ${error.message}`;
    }
  }

  async update() {
    await this.initialize();
    const body = this.req.body;
    const transactionId = body.id;
    const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  
    try {
      const namaPetugas = await this.petugas();
  
      if (!transactionId) {
        throw new Error("ID transaksi tidak boleh kosong.");
      }
  
      // Cari transaksi utama
      const existingTransaction = await Visa_transaction.findOne({
        where: {
          id: transactionId,
          company_id: this.company_id
        }
      });
  
      if (!existingTransaction) {
        throw new Error("Transaksi tidak ditemukan atau bukan milik perusahaan ini.");
      }
  
      // Update transaksi utama
      await Visa_transaction.update({
        invoice: body.invoice ?? existingTransaction.invoice,
        payer: body.payer ?? existingTransaction.payer,
        payer_identity: body.payer_identity ?? existingTransaction.payer_identity,
        updatedAt: now,
      }, {
        where: {
          id: transactionId,
          company_id: this.company_id
        },
        transaction: this.t
      });
  
      // Cari detail transaksi
      const existingDetail = await Visa_transaction_detail.findOne({
        where: { visa_transaction_id: transactionId }
      });
  
      if (!existingDetail) {
        throw new Error("Detail transaksi tidak ditemukan.");
      }
  
      // Dapatkan ID jenis visa jika diubah
      let visaTypeId = existingDetail.mst_visa_request_type_id;
      if (body.jenis_visa) {
        visaTypeId = await this.findOrCreateVisaType(body.jenis_visa);
      }
  
      // Update detail
      await Visa_transaction_detail.update({
        mst_visa_request_type_id: visaTypeId,
        name: body.name ?? existingDetail.name,
        identity_number: body.identity_number ?? existingDetail.identity_number,
        gender: body.gender ? body.gender.toLowerCase().replace("-", "_") : existingDetail.gender,
        birth_place: body.birth_place ?? existingDetail.birth_place,
        birth_date: body.birth_date ?? existingDetail.birth_date,
        citizenship: body.nationality ?? existingDetail.citizenship,
        passport_number: body.passport_number ?? existingDetail.passport_number,
        date_issued: body.passport_issued_date ?? existingDetail.date_issued,
        place_of_release: body.passport_issued_place ?? existingDetail.place_of_release,
        valid_until: body.valid_until ?? existingDetail.valid_until,
        profession_idn: body.indonesia_job ?? existingDetail.profession_idn,
        profession_foreign: body.abroad_job ?? existingDetail.profession_foreign,
        profession_address: body.work_address ?? existingDetail.profession_address,
        pofession_pos_code: body.postal_code ?? existingDetail.pofession_pos_code,
        profession_city: body.city ?? existingDetail.profession_city,
        profession_country: body.origin_country ?? existingDetail.profession_country,
        profession_telephone: body.phone ?? existingDetail.profession_telephone,
        price: body.price ?? existingDetail.price,
        updatedAt: now,
      }, {
        where: { visa_transaction_id: transactionId },
        transaction: this.t
      });
  
      this.message = `Berhasil mengupdate transaksi visa dengan ID ${transactionId} oleh petugas ${namaPetugas}`;
    } catch (error) {
      console.error("Error di model CUD update:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  //Menghapus data transaksi visa dari database.
  async hapus(transactionId) { // Terima ID sebagai parameter
    await this.initialize();

    try {
      const namaPetugas = await this.petugas(); //
      const existingTransaction = await Visa_transaction.findOne({
        where: {
          id: transactionId,
          company_id: this.company_id
        } //
      });

      if (!existingTransaction) {
        throw new Error("Data transaksi visa tidak ditemukan atau Anda tidak memiliki akses"); //
      }

      // Hapus detail transaksi terlebih dahulu
      await Visa_transaction_detail.destroy({
        where: { visa_transaction_id: transactionId },
        transaction: this.t
      }); //

      // Hapus transaksi utama
      await Visa_transaction.destroy({
        where: {
          id: transactionId,
          company_id: this.company_id
        },
        transaction: this.t
      }); //

      this.message = `Menghapus Transaksi Visa dengan ID: ${transactionId} untuk pelanggan: ${existingTransaction.payer} oleh petugas: ${namaPetugas}`; //

    } catch (error) {
      console.error("Error di model CUD hapus:", error);
      this.state = false; //
      this.message = error.message; //
    }
  }

  //Menyelesaikan transaksi (commit atau rollback) dan menulis log.
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message }); //
      await this.t.commit(); //
      return true; //
    } else {
      await this.t.rollback(); //
      return false; //
    }
  }
}



module.exports = Model_cud;