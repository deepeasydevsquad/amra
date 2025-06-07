'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visa_transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Visa_transaction_detail.belongsTo(models.Mst_visa_request_type, {
        foreignKey: "mst_visa_request_type_id",
      });
      Visa_transaction_detail.belongsTo(models.Visa_transaction, {
        foreignKey: "visa_transaction_id",
      });
      Visa_transaction_detail.belongsTo(models.Mst_kota, {
        foreignKey: "profession_city",
      });
    }
  }
  Visa_transaction_detail.init({
    visa_transaction_id: DataTypes.INTEGER,
    mst_visa_request_type_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    identity_number: DataTypes.STRING,
    gender: DataTypes.ENUM(['laki_laki', 'perempuan']),
    birth_place: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    citizenship: DataTypes.STRING,
    passport_number: DataTypes.STRING,
    date_issued: DataTypes.DATEONLY,
    place_of_release: DataTypes.STRING,
    valid_until: DataTypes.DATEONLY,
    profession_idn: DataTypes.TEXT,
    profession_foreign: DataTypes.TEXT,
    profession_address: DataTypes.TEXT,
    pofession_pos_code: DataTypes.STRING,
    profession_city: DataTypes.INTEGER,
    profession_country: DataTypes.STRING,
    profession_telephone: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Visa_transaction_detail',
  });
  return Visa_transaction_detail;
};