'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ticket_transaction_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Ticket_transactions",
          key: "id",
        },
      },
      pax: {
        type: Sequelize.INTEGER
      },
      code_booking: {
        type: Sequelize.STRING
      },
      airlines_id: {
        type: Sequelize.INTEGER
      },
      departure_date: {
        type: Sequelize.DATE
      },
      travel_price: {
        type: Sequelize.INTEGER
      },
      costumer_price: {
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
    await queryInterface.dropTable('Ticket_transaction_details');
  }
};