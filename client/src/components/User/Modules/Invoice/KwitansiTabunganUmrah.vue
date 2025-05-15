<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKwitansiTabunganUmrah } from '@/service/invoice.ts'
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue'

const route = useRoute()
const invoice = route.params.id
const data = ref<any>(null)

const fetchData = async () => {
  try {
    const response = await getKwitansiTabunganUmrah(invoice.toString())
    data.value = response.data
  } catch (error) {
    console.error("Gagal ambil data kwitansi:", error)
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
}

onMounted(() => {
  fetchData()
  setTimeout(() => {
    window.scrollTo(0, 0)
    window.print()
    // setTimeout(() => {
    //   window.close()
    // }, 1000)
  }, 1500)
})
</script>

<template>
  <div class="bg-white p-8 text-sm text-gray-900 min-h-screen">
    <div v-if="data">
      <Header :data="data"></Header>
      <!-- Header Kwitansi -->

      <!-- Judul -->
      <h2 class="text-center text-lg font-bold border-b pb-2 mb-4">
        KWITANSI PEMBAYARAN TABUNGAN UMRAH
      </h2>
      <!-- Info Jamaah & Transaksi -->
      <div class="border rounded p-4 bg-white shadow-sm mb-6 text-xs">
        <div class="grid grid-cols-5 gap-4">
          <div>
            <p class="text-gray-500 font-bold">Kode Transaksi</p>
            <p class="font-medium">{{ data.invoice }}</p>
          </div>
          <div>
            <p class="text-gray-500 font-bold">Sumber Dana</p>
            <p class="font-medium">{{ data.sumber_dana }}</p>
          </div>
          <div>
            <p class="text-gray-500 font-bold">Status Transaksi</p>
            <p class="font-medium">Sukses</p>
          </div>
          <div>
            <p class="text-gray-500 font-bold">Keperluan</p>
            <p class="font-medium">Tabungan Umrah</p>
          </div>
          <div>
            <p class="text-gray-500 font-bold">Info Calon Jamaah</p>
            <p class="font-medium">
              {{ data.fullname }}<br />
              <span class="text-gray-700">(WA : {{ data.whatsapp_number }})</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Tabel Transaksi -->
      <div class="border rounded p-4 bg-white shadow-sm mb-6">
        <h2 class="text-md font-bold mb-2 pb-2">Detail Transaksi</h2>
        <table class="w-full text-center border border-collapse mb-6 text-sm print:text-xs border-b border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border-b border-gray-300 p-2">Tanggal</th>
              <th class="border-b border-gray-300 p-2">Keperluan</th>
              <th class="border-b border-gray-300 p-2">Penerima</th>
              <th class="border-b border-gray-300 p-2">Info</th>
              <th class="border-b border-gray-300 p-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-b border-gray-300 p-2">{{ formatDate(data.createdAt) }}</td>
              <td class="border-b border-gray-300 p-2">Tabungan Umrah</td>
              <td class="border-b border-gray-300 p-2">{{ data.penerima }}</td>
              <td class="border-b border-gray-300 p-2">{{ data.info_tabungan }}</td>
              <td class="border-b border-gray-300 p-2">{{ formatCurrency(data.nominal_tabungan) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="border-b border-gray-300 p-2 text-right">Saldo Sebelumnya</td>
              <td class="border-b border-gray-300 p-2">{{ formatCurrency(data.saldo_tabungan_sebelum) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="border-b border-gray-300 p-2 text-right font-bold">Saldo Sekarang</td>
              <td class="border-b border-gray-300 p-2 font-bold">{{ formatCurrency(data.saldo_tabungan_sesudah) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Tanda Tangan -->
      <div class="flex justify-between text-center mt-12">
        <div>
          <p class="mb-12">Member/Jamaah</p>
          <p class="border-t border-gray-400 w-48 mx-auto"></p>
        </div>
        <div>
          <p class="mb-12">Penerima</p>
          <p class="border-t border-gray-400 w-48 mx-auto"></p>
        </div>
      </div>
    </div>

    <!-- Jika data kosong -->
    <div v-else class="text-center text-red-600 py-12">
      <p class="text-lg font-semibold">Data tidak ditemukan</p>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 10mm;
    -webkit-print-color-adjust: exact;
  }
}
</style>
