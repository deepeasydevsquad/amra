'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket_transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket_transaction_detail.belongsTo(models.Ticket_transaction, {
        foreignKey: "ticket_transaction_id",
      });
    }
  }
  Ticket_transaction_detail.init({
    ticket_transaction_id: DataTypes.INTEGER,
    pax: DataTypes.INTEGER,
    code_booking: DataTypes.STRING,
    airlines_id: DataTypes.INTEGER,
    departure_date: DataTypes.DATE,
    travel_price: DataTypes.INTEGER,
    costumer_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket_transaction_detail',
  });
  return Ticket_transaction_detail;
};