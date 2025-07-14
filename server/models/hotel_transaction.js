'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel_transaction.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Hotel_transaction.belongsTo(models.Kostumer, {
        foreignKey: "kostumer_id",
      });
      Hotel_transaction.hasMany(models.Hotel_transaction_detail, {
        foreignKey: "hotel_transaction_id",
        onDelete: 'CASCADE',
      });
    }
  }
  Hotel_transaction.init({
    company_id: DataTypes.INTEGER,
    invoice: DataTypes.STRING,
    petugas: DataTypes.STRING,
    kostumer_id: DataTypes.INTEGER,
    paket_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Hotel_transaction',
  });
  return Hotel_transaction;
};