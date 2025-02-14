"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
const config = require("../../../config/config.json")[
  process.env.NODE_ENV || "development"
];

// **Inisialisasi Sequelize**
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false, // Set ke true kalau mau lihat query di console
  }
);

// **Model Otp**
class Otp extends Model {}

Otp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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

// **Model AmraSettings**
class AmraSettings extends Model {}

AmraSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    modelName: "AmraSettings",
    tableName: "amra_settings",
    timestamps: true, // Sesuai dengan database kamu
  }
);

// **Export semua model dan koneksi**
module.exports = { Otp, AmraSettings, sequelize };
