<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-end items-center mb-4">
      <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
      <input
        type="text"
        id="search"
        class="block w-70 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Cari berdasarkan nama..."
      />
    </div>

    <!-- Agen Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[45%] px-6 py-4 font-bold text-gray-900 text-center">Nama Agen</th>
            <th class="w-[45%] px-6 py-4 font-bold text-gray-900 text-center">Level Keagenan</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="4" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#455494]"></div>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="agens.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-base text-gray-600">
              {{ searchQuery ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data Agen' }}
            </td>
          </tr>

          <!-- Agen Data -->
          <tr v-for="agen in agens" :key="agen.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-center">{{ agen.Member?.fullname || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ agen.Level_keagenan?.name || '-' }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <DangerButton @click="confirmDelete(agen.id)" title="Hapus Agen">
                  <DeleteIcon />
                </DangerButton>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Pagination Footer -->
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-left border min-h-[200px]" colspan="4">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px">
                  <!-- Previous Button -->
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li>

                  <!-- First Page -->
                  <li v-if="currentPage > Math.floor(maxVisiblePages / 2) + 1">
                    <button
                      @click="goToPage(1)"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    >
                      1
                    </button>
                  </li>
                  <li v-if="currentPage > Math.floor(maxVisiblePages / 2) + 1" class="px-2 py-2">
                    ...
                  </li>

                  <!-- Page Numbers -->
                  <li
                    v-for="page in visiblePages"
                    :key="page"
                    v-if="agens.length > 0 && !isLoading"
                  >
                    <button
                      @click="goToPage(page)"
                      class="px-3 py-2 leading-tight border"
                      :class="{
                        'text-white bg-[#333a48] border-[#333a48]': currentPage === page,
                        'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700':
                          currentPage !== page,
                      }"
                    >
                      {{ page }}
                    </button>
                  </li>

                  <!-- Last Page -->
                  <li
                    v-if="currentPage < totalPages - Math.floor(maxVisiblePages / 2)"
                    class="px-2 py-2"
                  >
                    ...
                  </li>
                  <li v-if="currentPage < totalPages - Math.floor(maxVisiblePages / 2)">
                    <button
                      @click="goToPage(totalPages)"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    >
                      {{ totalPages }}
                    </button>
                  </li>

                  <!-- Next Button -->
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

  <!-- Delete Confirmation Modal -->
  <Confirmation
    :showConfirmDialog="showDeleteConfirmDialog"
    confirmTitle="Konfirmasi Hapus"
    confirmMessage="Apakah Anda yakin ingin menghapus agen ini?"
  >
    <button
      @click="executeDelete"
      class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Ya
    </button>
    <button
      @click="showDeleteConfirmDialog = false"
      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Tidak
    </button>
  </Confirmation>

  <!-- Notification Component -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarAgen, deleteAgen } from '../../../../service/agen'
import Confirmation from './Particle/Confirmation.vue'
import Notification from './Particle/Notification.vue'
import DeleteIcon from './Icon/DeleteIcon.vue'
import DangerButton from './Particle/DangerButton.vue'

// Reactive State
const agens = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const maxVisiblePages = 5
const isLoading = ref(false)
const showDeleteConfirmDialog = ref(false)
const agenIdToDelete = ref(null)

// Notification State
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

// Computed Properties
const visiblePages = computed(() => {
  const pages = []
  const halfVisible = Math.floor(maxVisiblePages / 2)

  let startPage = currentPage.value - halfVisible
  let endPage = currentPage.value + halfVisible

  // Adjust if we're near the start
  if (startPage < 1) {
    startPage = 1
    endPage = Math.min(maxVisiblePages, totalPages.value)
  }

  // Adjust if we're near the end
  if (endPage > totalPages.value) {
    endPage = totalPages.value
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const fetchAgens = async () => {
  isLoading.value = true
  try {
    const response = await daftarAgen({
      page: currentPage.value,
      search: searchQuery.value,
      limit: itemsPerPage.value,
    })

    agens.value = response.data || []
    console.log('Data agen:', agens.value)
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1

    // Adjust current page if it's out of bounds
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await fetchAgens() // Refetch with corrected page
      return
    }
  } catch (error) {
    console.error('Gagal memuat data agen:', error)
    displayNotification('Gagal memuat data agen', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // Reset to first page when searching
  currentPage.value = 1

  // Debounce the search input
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = window.setTimeout(() => {
    fetchAgens()
  }, 500)
}

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  resetNotificationTimeout()
}

const resetNotificationTimeout = () => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Pagination Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchAgens()
  }
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)

// Agen Actions
const confirmDelete = (id) => {
  agenIdToDelete.value = id
  showDeleteConfirmDialog.value = true
}

const executeDelete = async () => {
  if (!agenIdToDelete.value) {
    console.error('ID agen yang akan dihapus tidak tersedia')
    return
  }

  try {
    const response = await deleteAgen(agenIdToDelete.value)
    console.log('Response dari backend:', response)

    displayNotification(response.message || 'Agen berhasil dihapus', 'success')

    // Jika menghapus item terakhir di halaman, kembali ke halaman sebelumnya
    if (agens.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    fetchAgens()
  } catch (error) {
    console.error('Error detail:', error)
    displayNotification(error.response?.data?.message || 'Gagal menghapus agen', 'error')
  } finally {
    showDeleteConfirmDialog.value = false
    agenIdToDelete.value = null
  }
}

// Lifecycle Hooks
onMounted(() => {
  fetchAgens()
})

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
})
</script>
