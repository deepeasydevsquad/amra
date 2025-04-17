'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil data kode provinsi dari tabel Provinces
    const kecamatans = await queryInterface.sequelize.query(
      `SELECT k.id, k.code AS kode_kecamatan, 
      kk.provinsi_id, kk.code AS kode_kabupaten_kota
      FROM Kecamatans AS k 
      INNER JOIN Kabupaten_kota AS kk`,
      { type: Sequelize.QueryTypes.SELECT }
    );



    let allKelurahan = [];

    for (const kecamatan of kecamatans) {

      console.log("_________________1");
      console.log(kecamatan);
      console.log("_________________1");
      const provinsi_id = kecamatan.provinsi_id.toString();
      const code_kabupaten_kota = kecamatan.kode_kabupaten_kota.toString();
      const code_kecamatan =  kecamatan.kode_kecamatan.toString();
      const id =  kecamatan.id;
      try {
        const res = await axios.get(`https://wilayah.id/api/villages/${provinsi_id}.${code_kabupaten_kota}.${code_kecamatan}.json`);
        const data = res.data?.data || [];

        console.log("xxxxx-------xxxxxx");
        console.log(data);
        console.log("xxxxx-------xxxxxx");
        const kelurahan = data.map(item => ({
          kecamatan_id: id,
          code : item.code.split('.')[3],
          name: item.name,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        // console.log("==============Keluarahan");
        // console.log(kelurahan);
        // console.log("==============Keluarahan");

        allKelurahan = allKelurahan.concat(kelurahan);
      } catch (err) {
        console.error(`Gagal ambil data untuk kecamatan ${code_kecamatan}:`, err.message);
      }
    }

    // console.log("==============QQQQ");
    // console.log(allKelurahan);
    // console.log("==============QQQQ");

    if (allKelurahan.length > 0) {
      await queryInterface.bulkInsert('Kelurahans', allKelurahan, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kelurahans', null, {});
  }
};
