<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDownloadData } from '@/service/kamar_paket'
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue' // Pastikan path header benar

const isLoading = ref(true)
const data = ref<any>(null)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await getDownloadData()
    if (response.error || !response.data) {
      errorMessage.value = `Gagal memuat data: ${response.error_msg || 'Data tidak ditemukan.'}`
      return
    }
    data.value = response.data
    setTimeout(() => window.print(), 1000)
  } catch (error: any) {
    errorMessage.value = `Terjadi kesalahan fatal: ${error.message}`
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span class="ml-2">Mempersiapkan data...</span>
  </div>

  <div
    v-else-if="errorMessage"
    class="flex flex-col justify-center items-center h-screen bg-red-50 p-4"
  >
    <div class="text-red-700 text-center">
      <h2 class="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
      <p>{{ errorMessage }}</p>
      <button
        @click="window.close()"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Tutup
      </button>
    </div>
  </div>

  <div
    v-else-if="data"
    class="bg-white max-w-[210mm] mx-auto p-[15mm] font-serif print:p-[10mm] print:m-0 print:shadow-none"
    style="color: black; font-size: 10pt"
  >
    <!-- Header Halaman Cetak -->
    <Header v-if="data.company" :data="data.company"></Header>
    <div class="border-b-2 border-black my-4"></div>
    <h2 class="text-lg font-bold text-center mb-6">DAFTAR KAMAR JAMAAH</h2>

    <!-- Daftar Kamar -->
    <div v-for="(room, index) in data.rooms" :key="index" class="mb-6 page-break-inside-avoid">
      <table class="w-full border-collapse border border-black text-xs">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-black p-2 text-left" colspan="2">INFORMASI KAMAR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-black p-2 w-1/4"><strong>Tipe Kamar</strong></td>
            <td class="border border-black p-2">{{ room.tipe_kamar }}</td>
          </tr>
          <tr>
            <td class="border border-black p-2"><strong>Hotel</strong></td>
            <td class="border border-black p-2">{{ room.hotel_name }} ({{ room.nama_kota }})</td>
          </tr>
          <tr>
            <td class="border border-black p-2"><strong>Kapasitas</strong></td>
            <td class="border border-black p-2">{{ room.kapasitas_kamar }} Orang</td>
          </tr>
        </tbody>
      </table>

      <h4 class="font-semibold mt-3 mb-1">Daftar Jamaah:</h4>
      <table class="w-full border-collapse border border-black text-xs">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-black p-2 text-left w-[5%]">No.</th>
            <th class="border border-black p-2 text-left w-[55%]">Nama Lengkap</th>
            <th class="border border-black p-2 text-left w-[40%]">Nomor Identitas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="room.jamaah.length === 0">
            <td colspan="3" class="border border-black p-2 text-center italic">
              Belum ada jamaah di kamar ini.
            </td>
          </tr>
          <tr v-for="(jamaah, jamaahIndex) in room.jamaah" :key="jamaahIndex">
            <td class="border border-black p-2 text-center">{{ jamaahIndex + 1 }}</td>
            <td class="border border-black p-2">{{ jamaah.nama }}</td>
            <td class="border border-black p-2">{{ jamaah.no_identity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  body,
  html {
    background: white;
    margin: 0;
    -webkit-print-color-adjust: exact;
  }
  .page-break-inside-avoid {
    page-break-inside: avoid;
  }
}
</style>
