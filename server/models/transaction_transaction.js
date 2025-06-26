'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction_transaction.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Transaction_transaction.hasMany(models.Transaction_transaction_detail, {
        foreignKey: "transport_transaction_id",
        onDelete: "CASCADE",
      });
    }
  }
  Transaction_transaction.init({
    company_id: DataTypes.INTEGER,
    invoice: DataTypes.STRING,
    petugas: DataTypes.STRING,
    payer: DataTypes.STRING,
    payer_identity: DataTypes.STRING,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Transaction_transaction',
  });
  return Transaction_transaction;
};