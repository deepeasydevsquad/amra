'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Paket_transactions', {
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
      fee_agen_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Fee_agens",
          key: "id",
        },
      },
      paket_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Pakets",
          key: "id",
        },
      },
      mst_paket_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_paket_types",
          key: "id",
        },
      },
      price: {
        type: Sequelize.INTEGER
      },
      nomor_visa: {
        type: Sequelize.INTEGER
      },
      tanggal_berlaku_visa: {
        type: Sequelize.DATEONLY
      },
      tanggal_berakhir_visa: {
        type: Sequelize.DATEONLY
      },
      batal_berangkat: {
        type: Sequelize.ENUM,
        values: ['ya','tidak'],
        defaultValue : "tidak"
      },
      biaya_mahram: {
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
    await queryInterface.dropTable('Paket_transactions');
  }
};