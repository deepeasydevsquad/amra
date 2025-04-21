'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pembayaran_fee_agens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Companies",
          key: "id",
        },
      },
      agen_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Agens",
          key: "id",
        },
      },
      invoice: {
        type: Sequelize.STRING
      },
      nominal: {
        type: Sequelize.INTEGER
      },
      applicant_name: {
        type: Sequelize.STRING
      },
      applicant_identity: {
        type: Sequelize.STRING
      },
      penerima: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pembayaran_fee_agens');
  }
};