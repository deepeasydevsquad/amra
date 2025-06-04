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
    }
  }
  Visa_transaction_detail.init({
    visa_transaction_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    identity_number: DataTypes.STRING,
    gender: DataTypes.ENUM,
    birth_place: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    citizenship: DataTypes.STRING,
    passport_number: DataTypes.STRING,
    date_issued: DataTypes.DATE,
    place_of_release: DataTypes.STRING,
    valid_until: DataTypes.DATE,
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