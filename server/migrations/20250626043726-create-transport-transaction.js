'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transport_transactions', {
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
        onDelete: 'CASCADE',
      },
      invoice: {
        type: Sequelize.STRING
      },
      petugas: {
        type: Sequelize.STRING
      },
      kostumer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Kostumers",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      address: {
        type: Sequelize.TEXT
      },
      paket_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Transport_transactions');
  }
};