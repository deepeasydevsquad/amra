'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const response = await axios.get('https://wilayah.id/api/provinces.json');
      const provinces = response.data.data.map(province => ({
        id: parseInt(province.code),
        name: province.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await queryInterface.bulkInsert('Provinsis', provinces, {});
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Provinsis', null, {});
  }
};
