<template>
  <div class="container mx-auto p-4">
    <!-- Pencarian & Filter -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="col-span-1 md:col-span-1 flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nama atau Invoice"
          class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
      <input
        v-model="filters.tanggal_awal"
        type="date"
        class="text-gray-700 px-3 py-2 border rounded-lg shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="filters.tanggal_akhir"
        type="date"
        class="text-gray-700 px-3 py-2 border rounded-lg shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div> -->
    <div class="flex justify-between mb-4">
      <div class="inline-flex rounded-md shadow-xs" role="group"></div>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <input v-model="searchQuery" type="text" placeholder="Nama atau Invoice" class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mr-5"/>
          <input v-model="filters.tanggal_awal" type="date" class="text-gray-700 px-3 py-2 border shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-s-lg"/>
          <input v-model="filters.tanggal_akhir" type="date" class="text-gray-700 px-3 py-2 border rounded-e-lg shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <span class="text-gray-500">Loading...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-4">
      <span class="text-red-500">{{ error }}</span>
    </div>

    <!-- Tabel System Log -->
    <div v-else class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Ne Registrasi / Invoice</th>
            <th class="w-[30%] px-6 py-4 font-bold text-gray-900 text-center">Info Jamaah</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Biaya</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Status Biaya</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Penerima</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Tanggal Transaksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="paginatedRiwayat.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Data tidak ada</td>
          </tr>
          <tr
            v-for="riwayat in paginatedRiwayat"
            :key="riwayat.invoice"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-center font-bold">
              {{ riwayat.register_number }}/<br>{{ riwayat.invoice }}
            </td>
            <td class="px-6 py-4 text-center">{{ riwayat.nama_jamaah }}<br>(Identitas: {{ riwayat.nomor_identitas }})</td>
            <td class="px-6 py-4 text-center">{{ formatIDR(riwayat.nominal) }}</td>
            <td class="px-6 py-4 text-center">{{ riwayat.status }}</td>
            <td class="px-6 py-4 text-center">{{ riwayat.petugas }}</td>
            <td class="px-6 py-4 text-center">{{ formatDate(riwayat.tanggal_transaksi) }}</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-left border min-h-[200px]"  :colspan="6">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px">
                  <!-- Tombol Previous -->
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li>
                  <!-- Nomor Halaman -->
                  <li v-for="page in pages" :key="page">
                    <button
                      @click="pageNow(page)"
                      class="px-3 py-2 leading-tight border"
                      :class="
                        currentPage === page
                          ? 'text-white bg-[#333a48] border-[#333a48]'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                      "
                    >
                      {{ page }}
                    </button>
                  </li>
                  <!-- Tombol Next -->
                  <li>
                    <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getRiwayatPeminjaman } from '@/service/riwayat_peminjaman'

// State utama
const riwayat = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Filter tanggal
const filters = ref({
  tanggal_awal: '',
  tanggal_akhir: '',
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 100

// Ambil data
const fetchRiwayatPeminjaman = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getRiwayatPeminjaman()
    riwayat.value = response.data
  } catch (err) {
    error.value = 'Gagal mengambil data riwayat peminjaman. Silakan coba lagi.'
    console.error('Error fetching system logs:', err)
  } finally {
    loading.value = false
  }
}

// Format tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format IDR
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// Filter berdasarkan nama, invoice, dan tanggal
const filteredRiwayat = computed(() => {
  return riwayat.value.filter((r) => {
    const search = searchQuery.value.toLowerCase()
    const matchSearch =
      r.nama_jamaah?.toLowerCase().includes(search) || r.invoice?.toLowerCase().includes(search)

    const tanggalTransaksi = new Date(r.tanggal_transaksi)
    const afterStart = filters.value.tanggal_awal
      ? tanggalTransaksi >= new Date(filters.value.tanggal_awal)
      : true
    const beforeEnd = filters.value.tanggal_akhir
      ? tanggalTransaksi <= new Date(filters.value.tanggal_akhir)
      : true

    return matchSearch && afterStart && beforeEnd
  })
})

// Pagination logic
const totalPages = computed(() => Math.ceil(filteredRiwayat.value.length / itemsPerPage))
const paginatedRiwayat = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRiwayat.value.slice(start, end)
})
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
const pageNow = (page: number) => (currentPage.value = page)
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(() => {
  fetchRiwayatPeminjaman()
})
</script>

<style scoped>
/* Optional styling */
</style>
