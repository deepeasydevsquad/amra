'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Agen.belongsTo(models.Level_keagenan, {
        foreignKey: "level_keagenan_id",
      });
      Agen.belongsTo(models.Member, {
        foreignKey: "member_id",
      });
      Agen.hasMany(models.Jamaah, {
        foreignKey: "agen_id",
      });
    }
  }
  Agen.init({
    member_id: DataTypes.INTEGER,
    level_keagenan_id: DataTypes.INTEGER,
    upline_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Agen',
  });
  return Agen;
};