"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hotel_transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel_transaction_detail.belongsTo(models.Hotel_transaction, {
        foreignKey: "hotel_transaction_id",
      });
      Hotel_transaction_detail.belongsTo(models.Mst_hotel, {
        foreignKey: "mst_hotel_id",
      });
      Hotel_transaction_detail.belongsTo(models.Mst_kota, {
        foreignKey: "mst_kota_id",
      });
    }
  }
  Hotel_transaction_detail.init(
    {
      hotel_transaction_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      birth_date: DataTypes.DATEONLY,
      birth_place: DataTypes.STRING,
      identity_number: DataTypes.STRING,
      mst_hotel_id: DataTypes.INTEGER,
      mst_kota_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      check_in: DataTypes.DATEONLY,
      check_out: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Hotel_transaction_detail",
    }
  );
  return Hotel_transaction_detail;
};
