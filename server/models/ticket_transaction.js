'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket_transaction.belongsTo(models.Division, {
        foreignKey: "division_id",
      });
      Ticket_transaction.hasMany(models.Ticket_payment_history, {
        foreignKey: "ticket_transaction_id",
        onDelete: 'CASCADE',
      });
      Ticket_transaction.hasMany(models.Ticket_transaction_detail, {
        foreignKey: "ticket_transaction_id",
        onDelete: 'CASCADE',
      });
    }
  }
  Ticket_transaction.init({
    division_id: DataTypes.INTEGER,
    nomor_register: DataTypes.STRING,
    total_transaksi: DataTypes.INTEGER,
    status: DataTypes.ENUM(['active', 'refund', 'cancel'])
  }, {
    sequelize,
    modelName: 'Ticket_transaction',
  });
  return Ticket_transaction;
};