<template>
  <div class="bg-white p-0 text-sm text-gray-800 min-h-screen">
    <!-- Wrapper PDF -->
    <div id="invoice" v-if="company && company.data">
      <!-- Header -->
      <Header :data="company.data" />

      <!-- Detail Invoice -->
      <div class="invoice-details">
        <h2 class="text-left text-xl font-bold mt-10 mb-4">Kwitansi Peminjaman Dana Jamaah</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <!-- No Register -->
          <div class="p-4 border border-gray-400 rounded-lg">
            <p class="font-semibold">No Register:</p>
            <p class="font-normal">{{ company.data.register_number }}</p>
          </div>

          <!-- Info Peminjaman -->
          <div class="p-4 border border-gray-400 rounded-lg">
            <p class="font-semibold">Info Peminjaman:</p>
            <ul class="list-disc pl-5">
              <li>
                Pinjaman:
                <span class="font-normal">{{ formatRupiah(company.data.pinjaman_nominal) }}</span>
              </li>
              <li>
                Tenor: <span class="font-normal">{{ company.data.pinjaman_tenor }} Bulan</span>
              </li>
              <li>
                Status: <span class="font-normal">{{ company.data.status_peminjaman }}</span>
              </li>
              <li>
                Sudah Dibayar:
                <span class="font-normal">{{ formatRupiah(company.data.total_pembayaran) }}</span>
              </li>
            </ul>
          </div>

          <!-- Info Jamaah -->
          <div class="p-4 border border-gray-400 rounded-lg">
            <p class="font-semibold">Info Jamaah:</p>
            <ul class="list-disc pl-5">
              <li>
                Nama: <span class="font-normal">{{ company.data.nama_jamaah }}</span>
              </li>
              <li>
                NIK: <span class="font-normal">{{ company.data.identity_number }}</span>
              </li>
            </ul>
          </div>

          <!-- Tanggal Transaksi -->
          <div class="p-4 border border-gray-400 rounded-lg">
            <p class="font-semibold">Tanggal Transaksi:</p>
            <p class="font-normal">{{ company.data.tanggal_pembayaran }}</p>
          </div>
        </div>

        <h3 class="text-left text-xl font-bold mt-10 mb-4">Detail Pembayaran Pinjaman</h3>
        <table class="min-w-full border border-gray-400 print-table">
          <thead>
            <tr>
              <th class="border border-gray-400">No. Invoice</th>
              <th class="border border-gray-400">Pembayaran</th>
              <th class="border border-gray-400">Status</th>
              <th class="border border-gray-400">Term</th>
              <th class="border border-gray-400">Tanggal Transaksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400">{{ company.data.invoice }}</td>
              <td class="border border-gray-400">{{ formatRupiah(company.data.nominal) }}</td>
              <td class="border border-gray-400">{{ company.data.status_pembayaran }}</td>
              <td class="border border-gray-400">{{ company.data.term }}</td>
              <td class="border border-gray-400">{{ company.data.tanggal_pembayaran }}</td>
            </tr>
          </tbody>
        </table>

        <!-- TTD -->
        <div class="mt-10 flex justify-end space-x-20 pr-10">
          <div class="flex flex-col items-center">
            <p class="font-semibold">Jamaah</p>
            <p class="mt-20">{{ company.data.nama_jamaah }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="font-semibold">Petugas</p>
            <p class="mt-20">{{ company.data.nama_petugas }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10">Memuat data invoice...</div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue'
import { ref, onMounted, nextTick } from 'vue'
import { getInvoicePembayaranPerbulan } from '@/service/invoice'
import { useRoute } from 'vue-router'

const route = useRoute()
const invoicePembayaranPerbulan = route.params.invoice
const company = ref<{ data: any } | null>(null)

onMounted(async () => {
  try {
    const response = await getInvoicePembayaranPerbulan(invoicePembayaranPerbulan)
    const isWrapped = 'data' in response && 'error' in response
    const data = isWrapped ? response.data : response

    company.value = { data }

    // Nunggu DOM update, baru trigger print
    await nextTick()
    window.print()
  } catch (error) {
    console.error('Gagal mengambil data invoice:', error)
  }
})

// Fungsi format rupiah
const formatRupiah = (value: number | string): string => {
  const angka = typeof value === 'number' ? value : parseInt(value)
  return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}
</script>

<style scoped>
.invoice-details {
  padding: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px 12px;
  text-align: left;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  th,
  td {
    border: 1px solid #000 !important;
  }

  .print-table {
    border: 1px solid #000;
  }

  button {
    display: none !important;
  }
}
</style>
