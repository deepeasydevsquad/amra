'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Division.hasMany(models.Saldo_akun, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Member, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Grup, {
        foreignKey: "division_id",
      });
      Division.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Division.hasMany(models.User, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Paket_la, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Paket, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Jurnal, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Jamaah, {
        foreignKey: "division_id",
      });
      Division.belongsTo(models.Mst_kota, {
        foreignKey: "kota_id",
      });
      Division.hasMany(models.Tabungan, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Ticket_transaction, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Whatsapp_message, {
        foreignKey: "division_id",
      });
      Division.hasMany(models.Paket_transaction, {
        foreignKey: "division_id",
      });
    }
  }
  Division.init({
    company_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    kota_id: DataTypes.INTEGER, 
    pos_code: DataTypes.STRING,
    address: DataTypes.TEXT,
    note: DataTypes.TEXT,
    tanda_tangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Division',
  });
  return Division;
};