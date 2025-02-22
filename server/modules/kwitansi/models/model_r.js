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
    timezone: "Asia/Jakarta",
  }
);

class AmraSetting extends Model {}
AmraSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Pastikan setiap key unik (tidak duplikat)
    },
    value: {
      type: DataTypes.STRING, // Bisa menyimpan angka atau teks
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AmraSetting",
    tableName: "amra_settings",
    timestamps: false, // Biasanya pengaturan tidak butuh timestamps
  }
);
// **Model Company**
class Company extends Model {}
Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "Company", tableName: "companies", timestamps: true }
);

// **Model Subscribtion_Payment_History**
class Subscribtion_Payment_History extends Model {}
Subscribtion_Payment_History.init(
  {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "companies",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Subscribtion_Payment_History",
    tableName: "subscribtion_payment_histories",
    timestamps: true,
  }
);

// **Relasi**
Company.hasMany(Subscribtion_Payment_History, { foreignKey: "company_id" });
Subscribtion_Payment_History.belongsTo(Company, { foreignKey: "company_id" });

// **Middleware untuk cek koneksi database**
const checkDBConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    next();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return res.status(500).json({ message: "Database connection failed" });
  }
};

// **Ekspor Model dan Middleware**
module.exports = {
  AmraSetting,
  sequelize,
  Company,
  Subscribtion_Payment_History,
  checkDBConnection, // Bisa dipakai di route level
};
