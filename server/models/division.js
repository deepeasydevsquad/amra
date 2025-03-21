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
    }
  }
  Division.init({
    company_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    city: DataTypes.STRING,
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