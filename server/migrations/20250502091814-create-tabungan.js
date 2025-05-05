'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tabungans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Divisions",
          key: "id",
        },
      },
      jamaah_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Jamaahs",
          key: "id",
        },
      },
      target_paket_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue : null,
        references: {
          model: "Pakets",
          key: "id",
        },
      },
      total_tabungan: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'non_active'],
        defaultValue : "active"
      },
      fee_agen_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue : null,
        references: {
          model: "Fee_agens",
          key: "id",
        },
      },
      batal_berangkat: {
        type: Sequelize.ENUM,
        values: ['ya', 'tidak'],
        defaultValue : "tidak"
      },
      transaksi_paket_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue : null,
      },
      sisa_pembelian: {
        type: Sequelize.INTEGER
      },
      invoice_sisa_deposit: {
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
    await queryInterface.dropTable('Tabungans');
  }
};