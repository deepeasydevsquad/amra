'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction_transaction_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // transport_transaction_id: {
      //   type: Sequelize.INTEGER
      // },
      transport_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Transaction_transactions",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      mst_mobil_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_mobils",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      car_number: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Transaction_transaction_details');
  }
};