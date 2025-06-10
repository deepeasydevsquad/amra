'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hotel_transaction_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotel_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Hotel_transactions",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATEONLY
      },
      birth_place: {
        type: Sequelize.STRING
      },
      identity_number: {
        type: Sequelize.STRING
      },
      mst_hotel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_hotels",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      mst_kota_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_kota",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      price: {
        type: Sequelize.INTEGER
      },
      check_in: {
        type: Sequelize.DATEONLY
      },
      check_out: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Hotel_transaction_details');
  }
};