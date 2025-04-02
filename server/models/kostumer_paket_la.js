'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kostumer_paket_la extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kostumer_paket_la.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Kostumer_paket_la.hasMany(models.Paket_la, {
        foreignKey: "kostumer_paket_la_id",
      });
    }
  }
  Kostumer_paket_la.init({
    company_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Kostumer_paket_la',
  });
  return Kostumer_paket_la;
};