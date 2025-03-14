<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">System Log</h1>

    <!-- Pencarian -->
    <div class="flex justify-end mb-4">
      <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari log..."
        class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
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
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 font-medium text-gray-900 text-center">Log Message</th>
            <th class="px-6 py-4 font-medium text-gray-900 text-center">User</th>
            <th class="px-6 py-4 font-medium text-gray-900 text-center">Transaction Date</th>
            <th class="px-6 py-4 font-medium text-gray-900 text-center">IP Address</th>
            <th class="px-6 py-4 font-medium text-gray-900 text-center">Company</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="paginatedLogs.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">Data tidak ada</td>
          </tr>
          <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-left">{{ log.logMsg }}</td>
            <td class="px-6 py-4 text-center">{{ log.userName }}</td>
            <td class="px-6 py-4 text-center">{{ formatDate(log.transactionDate) }}</td>
            <td class="px-6 py-4 text-center">{{ log.logIpAccess }}</td>
            <td class="px-6 py-4 text-center">{{ log.companyName }}</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="5">
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
import { getSistemLog } from '@/service/sistem_log'

// State untuk menyimpan data, loading, dan error
const logs = ref([])
const loading = ref(true)
const error = ref<string | null>(null)

// State untuk pencarian
const searchQuery = ref('')

// State untuk pagination
const currentPage = ref(1)
const itemsPerPage = 100

// Fungsi untuk mengambil data log
const fetchSistemLog = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getSistemLog()
    logs.value = response.data // Sesuaikan dengan struktur response API
  } catch (err) {
    error.value = 'Gagal mengambil data log. Silakan coba lagi.'
    console.error('Error fetching system logs:', err)
  } finally {
    loading.value = false
  }
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString() // Sesuaikan format sesuai kebutuhan
}

// Filter logs berdasarkan pencarian
const filteredLogs = computed(() => {
  if (!searchQuery.value) return logs.value
  return logs.value.filter((log) => {
    return (
      log.logMsg.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// Pagination logic
const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
const pageNow = (page: number) => {
  currentPage.value = page
}

// Fungsi untuk navigasi halaman
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Ambil data saat komponen dimuat
onMounted(() => {
  fetchSistemLog()
})
</script>

<style scoped>
/* Tambahkan custom CSS jika diperlukan */
</style>
