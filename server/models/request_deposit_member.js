'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request_deposit_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Request_deposit_member.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Request_deposit_member.belongsTo(models.Member, {
        foreignKey: "member_id",
      });
      Request_deposit_member.belongsTo(models.Akun_bank_perusahaan, {
        foreignKey: "akun_bank_perusahaan_id",
      });
    }
  }
  Request_deposit_member.init({
    company_id: DataTypes.INTEGER,
    member_id: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    status: DataTypes.ENUM(['disetujui', 'ditolak',"diproses"]),
    status_note: DataTypes.TEXT,
    petugas: DataTypes.STRING,
    akun_bank_perusahaan_id: DataTypes.INTEGER,
    sending_payment_status: DataTypes.ENUM(['belum_dikirim', 'sudah_dikirim'])
  }, {
    sequelize,
    modelName: 'Request_deposit_member',
  });
  return Request_deposit_member;
};


// status: {
//         type: Sequelize.ENUM,
//         values: ['disetujui', 'ditolak',"diproses"],
//         defaultValue : "diproses"
//       },
//       status_note: {
//         type: Sequelize.TEXT
//       },
//       petugas: {
//         type: Sequelize.STRING
//       },
//       akun_bank_perusahaan_id: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: "Akun_bank_perusahaans",
//           key: "id",
//         },
//         onDelete: 'CASCADE',
//       },
//       sending_payment_status: {
//         type: Sequelize.ENUM,
//         values: ['belum_dikirim', 'sudah_dikirim'],
//         defaultValue : "belum_dikirim"
//       },