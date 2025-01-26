"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Member.hasMany(models.Permohonan, {
        foreignKey: "member_id",
      });
      // Member.hasMany(models.Pemasukan, {
      //   foreignKey: "member_id",
      // });
      // Member.hasMany(models.Riwayat_donasi, {
      //   foreignKey: "member_id",
      // });
      // Member.belongsTo(models.Desa, {
      //   foreignKey: "desa_id",
      // });
    }
  }
  Member.init(
    {
      kode: DataTypes.STRING,
      tipe: DataTypes.ENUM(["perorangan", "instansi"]),
      fullname: DataTypes.STRING,
      nomor_ktp: DataTypes.STRING,
      nomor_kk: DataTypes.STRING,
      whatsapp_number: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      desa_id: DataTypes.INTEGER,
      alamat: DataTypes.TEXT,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.ENUM(["unverified", "verified"]),
    },
    {
      sequelize,
      modelName: "Member",
    }
  );
  return Member;
};
