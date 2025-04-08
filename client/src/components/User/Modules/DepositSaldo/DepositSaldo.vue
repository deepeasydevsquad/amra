<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <!-- Button Tambah Deposit -->
      <button
        @click="openModal()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-fit"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c1.104 0 2 .672 2 1.5S13.104 11 12 11s-2 .672-2 1.5S10.896 14 12 14m0-6v1m0 6v1m9-5a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Tambah Deposit
      </button>

      <!-- Search Input -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label for="search" class="text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          id="search"
          class="w-full sm:w-72 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Cari berdasarkan nama..."
        />
      </div>
    </div>

    <!-- Deposit Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Nomor Transaksi</th>
            <th class="w-[30%] px-6 py-4 font-bold text-gray-900 text-center">Info Member</th>
            <th class="w-[30%] px-6 py-4 font-bold text-gray-900 text-center">Info</th>
            <th class="w-[20%] px-6 py-4 font-bold text-gray-900 text-center">Waktu Transaksi</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="5" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#455494]"></div>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="deposits.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-base text-gray-600">
              {{ searchQuery ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data deposit' }}
            </td>
          </tr>

          <!-- Deposit Data -->
          <tr
            v-for="deposit in deposits"
            :key="deposits.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-center">{{ deposit.invoice || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ deposit.fullname || '-' }}</td>
            <td class="px-6 py-4 text-left">
              <ul class="space-y-1 text-sm">
                <li class="flex items-start">
                  <span class="text-gray-600 mr-2">➤</span>
                  <div>
                    <span class="font-medium">Saldo Sebelum:</span>
                    {{
                      deposit.saldo_sebelum
                        ? 'Rp' + new Intl.NumberFormat('id-ID').format(deposit.saldo_sebelum)
                        : '-'
                    }}
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-gray-600 mr-2">➤</span>
                  <div>
                    <span class="font-medium">Saldo Sesudah:</span>
                    {{
                      deposit.saldo_sesudah
                        ? 'Rp' + new Intl.NumberFormat('id-ID').format(deposit.saldo_sesudah)
                        : '-'
                    }}
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-gray-600 mr-2">➤</span>
                  <div>
                    <span class="font-medium">Penerima:</span> {{ deposit.penerima || '-' }}
                  </div>
                </li>
              </ul>
            </td>
            <td class="px-6 py-4 text-center">{{ formatDate(deposit.createdAt) || '-' }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <DangerButton @click="" title="Print Invoice">
                  <DeleteIcon />
                </DangerButton>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Pagination Footer -->
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-left border min-h-[200px]" colspan="5">
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
                    v-if="deposits.length > 0 && !isLoading"
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

  <FormAdd v-if="showFormAdd" @close="showFormAdd = false" @success="handleAdd" />

  <!-- Delete Confirmation Modal -->
  <Confirmation
    :showConfirmDialog="showDeleteConfirmDialog"
    confirmTitle="Konfirmasi Hapus"
    confirmMessage="Apakah Anda yakin ingin menghapus deposit ini?"
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
import { daftarDeposit } from '../../../../service/deposit_saldo'
import Confirmation from './Particle/Confirmation.vue'
import Notification from './Particle/Notification.vue'
import DeleteIcon from './Icon/DeleteIcon.vue'
import DangerButton from './Particle/DangerButton.vue'
import FormAdd from './Particle/FormAdd.vue'

// Reactive State
const deposits = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const maxVisiblePages = 5
const isLoading = ref(false)
const showDeleteConfirmDialog = ref(false)

// Notification State
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

const showFormAdd = ref(false)

const openModal = () => {
  showFormAdd.value = true
}

const handleDepositSuccess = () => {
  showFormAdd.value = false
  fetchDeposit() // Refresh data
  displayNotification('Deposit berhasil ditambahkan', 'success')
}

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

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-' // handle invalid date

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  }

  return new Intl.DateTimeFormat('id-ID', options).format(date)
}

const fetchDeposit = async () => {
  isLoading.value = true
  try {
    const response = await daftarDeposit({
      pageNumber: currentPage.value,
      search: searchQuery.value,
      perpage: itemsPerPage.value,
    })

    deposits.value = response.data || []
    console.log('Data deposit:', deposits.value)
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1

    // Adjust current page if it's out of bounds
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await fetchDeposit() // Refetch with corrected page
      return
    }
  } catch (error) {
    console.error('Gagal memuat data deposit:', error)
    displayNotification('Gagal memuat data deposit', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // Reset to first page when searching
  currentPage.value = 1

  // Debounce the search input
  // if (searchTimeout.value) {
  //   clearTimeout(searchTimeout.value)
  // }

  fetchDeposit()

  // searchTimeout.value = window.setTimeout(() => {

  // }, 500)
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
    fetchDeposit()
  }
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)

const handleAdd = async (data: any) => {
  showFormAdd.value = false
  fetchDeposit()
  displayNotification('Deposit berhasil ditambahkan', 'success')
}

// Lifecycle Hooks
onMounted(() => {
  fetchDeposit()
})

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
})
</script>
