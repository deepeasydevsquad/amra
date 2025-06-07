'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Visa_transaction_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visa_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Visa_transactions",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      mst_visa_request_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_visa_request_types",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING
      },
      identity_number: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['laki_laki', 'perempuan'],
        defaultValue : "laki_laki"
      },
      birth_place: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATEONLY
      },
      citizenship: {
        type: Sequelize.STRING
      },
      passport_number: {
        type: Sequelize.STRING
      },
      date_issued: {
        type: Sequelize.DATEONLY
      },
      place_of_release: {
        type: Sequelize.STRING
      },
      valid_until: {
        type: Sequelize.DATEONLY
      },
      profession_idn: {
        type: Sequelize.TEXT
      },
      profession_foreign: {
        type: Sequelize.TEXT
      },
      profession_address: {
        type: Sequelize.TEXT
      },
      pofession_pos_code: {
        type: Sequelize.STRING
      },
      profession_city: {
        type: Sequelize.INTEGER,
        references: {
          model: "Mst_kota",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      profession_country: {
        type: Sequelize.STRING
      },
      profession_telephone: {
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
    await queryInterface.dropTable('Visa_transaction_details');
  }
};