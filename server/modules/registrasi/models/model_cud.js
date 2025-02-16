"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
const config = require("../../../config/config.json")[
  process.env.NODE_ENV || "development"
];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

// ✅ Model `Company`
class Company extends Model {}
Company.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    kurs: { type: DataTypes.STRING, defaultValue: "rp" },
    logo: { type: DataTypes.STRING, defaultValue: "" },
    icon: { type: DataTypes.STRING, defaultValue: "" },
    company_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.STRING, defaultValue: "limited" },
    verify_status: { type: DataTypes.STRING, defaultValue: "unverified" },
    verify_time: { type: DataTypes.DATE, allowNull: true },
    whatsapp_company_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otp: { type: DataTypes.STRING, allowNull: false },
    otp_expired_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    invoice_logo: { type: DataTypes.STRING, allowNull: true },
    invoice_title: { type: DataTypes.STRING, allowNull: true },
    start_subscribtion: { type: DataTypes.DATE, allowNull: false },
    end_subscribtion: { type: DataTypes.DATE, allowNull: false },
    whatsapp_device_number: { type: DataTypes.STRING, allowNull: true },
    whatsapp_device_key: { type: DataTypes.STRING, allowNull: true },
    refresh_token: { type: DataTypes.STRING, allowNull: false, unique: true },
    saldo: { type: DataTypes.INTEGER, defaultValue: 0 },
    markup_ppob: { type: DataTypes.INTEGER, defaultValue: 0 },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    start_date_subscribtion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    end_date_subscribtion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    timestamps: false,
    underscored: false,
  }
);

// ✅ Model `SubscriptionPaymentHistory`
class SubscriptionPaymentHistory extends Model {}
SubscriptionPaymentHistory.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
  },
  {
    sequelize,
    modelName: "SubscriptionPaymentHistory",
    tableName: "subscribtion_payment_histories",
    timestamps: false,
    underscored: false,
  }
);

// ✅ Model `AmraSettings`
class AmraSettings extends Model {}
AmraSettings.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "AmraSettings",
    tableName: "amra_settings",
    timestamps: false,
    underscored: false,
  }
);

// ✅ Model `Otp`
class Otp extends Model {}
Otp.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    otp_code: { type: DataTypes.STRING, allowNull: false },
    expired_time: { type: DataTypes.DATE, allowNull: false },
    mobile_number: { type: DataTypes.STRING, allowNull: false },
    otp_type: {
      type: DataTypes.ENUM("registration", "login"),
      allowNull: false,
    },
    otp_status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
    },
    user_type: { type: DataTypes.ENUM("amra", "company"), allowNull: false },
  },
  {
    sequelize,
    modelName: "Otp",
    tableName: "otps",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    underscored: false,
  }
);

// ✅ Sync Database
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database Synced"))
  .catch((err) => console.error("❌ Database Sync Failed:", err));

// ✅ Export Models dan Sequelize Instance
module.exports = {
  Company,
  SubscriptionPaymentHistory,
  AmraSettings,
  Otp,
  sequelize,
};
