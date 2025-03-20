'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mst_paket_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mst_paket_type.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
    }
  }
  Mst_paket_type.init({
    company_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mst_paket_type',
  });
  return Mst_paket_type;
};