'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil data kode provinsi dari tabel Provinces
    const kabupaten_kotas = await queryInterface.sequelize.query(
      `SELECT id, provinsi_id, code FROM Kabupaten_kota`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let allKecamatan = [];

    for (const kabupaten_kota of kabupaten_kotas) {
      const provinsi_id = kabupaten_kota.provinsi_id.toString();
      const code = kabupaten_kota.code.toString();
      const id =  kabupaten_kota.id;
      try {
        const res = await axios.get(`https://wilayah.id/api/districts/${provinsi_id}.${code}.json`);
        const data = res.data?.data || [];
        const kecamatan = data.map(item => ({
          kabupaten_kota_id: id,
          code : item.code.split('.')[2],
          name: item.name,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        console.log("==============AAA");
        console.log(kecamatan);
        console.log("==============AAA");

        allKecamatan = allKecamatan.concat(kecamatan);
      } catch (err) {
        console.error(`Gagal ambil data untuk provinsi ${code}:`, err.message);
      }
    }

    console.log("==============");
    console.log(allKecamatan);
    console.log("==============");

    if (allKecamatan.length > 0) {
      await queryInterface.bulkInsert('Kecamatans', allKecamatan, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kecamatans', null, {});
  }
};
