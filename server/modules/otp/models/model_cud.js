"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
const config = require("../../../config/config.json")[
  process.env.NODE_ENV || "development"
]; // Gunakan sesuai env

// **Inisialisasi Sequelize**
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: console.log, // Biar query keliatan di console
  }
);

class Otp extends Model {
  static associate(models) {
    // Jika ada relasi, tambahkan di sini
  }
}

Otp.init(
  {
    otp_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp_type: {
      type: DataTypes.ENUM("registration", "login"),
      allowNull: false,
      defaultValue: "registration",
    },
    otp_status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    user_type: {
      type: DataTypes.ENUM("amra", "company"),
      allowNull: false,
      defaultValue: "amra",
    },
  },
  {
    sequelize,
    modelName: "Otp",
    tableName: "otps",
    timestamps: true, // Auto createdAt & updatedAt
  }
);

// **Export sequelize & model Otp**
module.exports = { Otp, sequelize };
