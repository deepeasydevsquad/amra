'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket_payment_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket_payment_history.belongsTo(models.Ticket_transaction, {
        foreignKey: "ticket_transaction_id",
      });
    }
  }
  Ticket_payment_history.init({
    ticket_transaction_id: DataTypes.INTEGER,
    invoice: DataTypes.STRING,
    costumer_name: DataTypes.STRING,
    costumer_identity: DataTypes.STRING,
    status: DataTypes.ENUM(['cash', 'refund']),
    petugas: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ticket_payment_history',
  });
  return Ticket_payment_history;
};