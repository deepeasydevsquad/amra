'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Peminjamans', {
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
      jamaah_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Jamaahs",
          key: "id",
        },
      },
      register_number: {
        type: Sequelize.STRING
      },
      status_peminjaman: {
        type: Sequelize.ENUM,
        values: ["lunas", "belum_lunas"],
        defaultValue : "belum_lunas"
      },
      nominal: {
        type: Sequelize.INTEGER
      },
      tenor: {
        type: Sequelize.INTEGER
      },
      dp: {
        type: Sequelize.INTEGER
      },
      petugas: {
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
    await queryInterface.dropTable('Peminjamans');
  }
};