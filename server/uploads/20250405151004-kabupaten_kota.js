'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil data kode provinsi dari tabel Provinces
    const provinces = await queryInterface.sequelize.query(
      `SELECT id FROM Provinsis`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let allRegencies = [];

    for (const province of provinces) {
      const code = province.id.toString();
      try {
        const res = await axios.get(`https://wilayah.id/api/regencies/${code}.json`);
        const data = res.data?.data || [];
        const regencies = data.map(item => ({
          code : item.code.split('.')[1],
          name: item.name,
          provinsi_id: parseInt(code),
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        allRegencies = allRegencies.concat(regencies);
      } catch (err) {
        console.error(`Gagal ambil data untuk provinsi ${code}:`, err.message);
      }
    }

    if (allRegencies.length > 0) {
      await queryInterface.bulkInsert('Kabupaten_kota', allRegencies, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kabupaten_kota', null, {});
  }
};
