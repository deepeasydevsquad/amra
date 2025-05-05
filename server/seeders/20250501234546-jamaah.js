'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jamaahs', [
      { 
        division_id: 1, 
        agen_id: null, 
        member_id: 1, 
        kelurahan_id: 1101012001,
        title: 'tuan',
        nama_ayah: 'Ahmad Zaki',
        nama_passport: 'Muhammad Iqbal',
        nomor_passport: '123456789', 
        tanggal_di_keluarkan_passport: '2024-01-01',
        tempat_di_keluarkan_passport: 'Langsa',
        masa_berlaku_passport: '2024-03-01',
        kode_pos: '23373',
        nomor_telephone: '231232',
        pengalaman_haji: 1, 
        tahun_haji: 0,
        pengalaman_umrah: 1, 
        tahun_umrah: 0,
        desease: '', 
        last_education: 2, 
        blood_type: 'O',
        photo_4_6: 'ada',
        photo_3_4: 'ada',
        fc_passport: 'ada',
        mst_pekerjaan_id: 1,
        profession_instantion_name: '',
        profession_instantion_address: '', 
        profession_instantion_telephone: '', 
        fc_kk: 'ada',
        fc_ktp: 'ada',
        buku_nikah: 'ada',
        akte_lahir: 'ada',
        buku_kuning: 'ada',
        keterangan: '',
        nama_keluarga: '', 
        alamat_keluarga: '',
        telephone_keluarga: '',
        status_nikah: 'belum_menikah',
        tanggal_nikah: null,
        kewarganegaraan: 'wni',
        createdAt: new Date(), 
        updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jamaahs', null, {});
  }
};
