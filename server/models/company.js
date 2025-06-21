"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.Division, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Subscribtion_payment_history, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_bank, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_fasilitas, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_hotel, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_kota, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_airline, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_airport, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_asuransi, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mst_provider, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Supplier, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Akun_secondary, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.System_log, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Level_keagenan, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Periode, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Deposit, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Mahram, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Peminjaman, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Skema_peminjaman, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Riwayat_pembayaran_peminjaman, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Fee_agen, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Pembayaran_fee_agen, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Konfigurasi_surat_menyurat, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Riwayat_surat_menyurat, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Whatsapp_setting, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Whatsapp_template, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Visa_transaction, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Hotel_transaction, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Passport_transaction, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Kamar, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
      Company.hasMany(models.Bus, {
        foreignKey: "company_id",
        onDelete: "CASCADE",
      });
    }
  }
  Company.init(
    {
      code: DataTypes.STRING,
      division_id: DataTypes.STRING,
      kurs: DataTypes.ENUM(["rp", "usd", "sar"]),
      division_id: DataTypes.STRING,
      logo: DataTypes.STRING,
      icon: DataTypes.STRING,
      company_name: DataTypes.STRING,
      email: DataTypes.STRING,
      type: DataTypes.ENUM(["limited", "unlimited"]),
      verify_status: DataTypes.ENUM(["verified", "unverified"]),
      verify_time: DataTypes.DATE,
      whatsapp_company_number: DataTypes.STRING,
      otp: DataTypes.STRING,
      otp_expired_time: DataTypes.DATE,
      invoice_logo: DataTypes.STRING,
      invoice_title: DataTypes.STRING,
      start_subscribtion: DataTypes.DATE,
      end_subscribtion: DataTypes.DATE,
      whatsapp_device_number: DataTypes.STRING,
      whatsapp_api_key: DataTypes.STRING,
      whatsapp_device_key: DataTypes.STRING,
      refresh_token: DataTypes.TEXT,
      saldo: DataTypes.INTEGER,
      markup_ppob: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  return Company;
};
