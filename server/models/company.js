"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.Division, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Subscribtion_payment_history, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Mst_bank, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Mst_fasilitas, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Mst_hotel, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Mst_kota, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Mst_mobil, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Saldo_akun, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Supplier, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.Akun_secondary, {
        foreignKey: "company_id",
      });
      Company.hasMany(models.System_log, {
        foreignKey: "company_id",
      });
     }
  }
  Company.init(
    {
      code: DataTypes.STRING,
      kurs: DataTypes.ENUM(["rp", "usd", 'sar']), 
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
