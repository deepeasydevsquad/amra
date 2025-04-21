'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mahrams', {
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
      mahram_id: {
        type: Sequelize.INTEGER
      },
      mst_mahram_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_mahram_types",
          key: "id",
        },
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
    await queryInterface.dropTable('Mahrams');
  }
};