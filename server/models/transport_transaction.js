'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transport_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transport_transaction.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Transport_transaction.hasMany(models.Transport_transaction_detail, {
        foreignKey: "transport_transaction_id",
        onDelete: "CASCADE",
      });
    }
  }
  Transport_transaction.init({
    company_id: DataTypes.INTEGER,
    invoice: DataTypes.STRING,
    petugas: DataTypes.STRING,
    payer: DataTypes.STRING,
    payer_identity: DataTypes.STRING,
    address: DataTypes.TEXT,
    paket_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Transport_transaction',
  });
  return Transport_transaction;
};