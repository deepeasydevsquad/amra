<template>
  <div class="container mx-auto p-4">
    <!-- Header dengan Add User dan Search -->
    <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <!-- Tombol Tambah Peminjaman -->
      <button
        @click="bukaModalPeminjaman()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Peminjaman
      </button>

      <!-- Input Pencarian -->
      <div class="flex flex-col md:flex-row items-center w-full md:w-auto gap-2">
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          id="search"
          class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Cari berdasarkan nama..."
        />
      </div>
    </div>

    <!-- Tabel Peminjaman -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 font-bold text-gray-900 text-left w-40">Nomor Register</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-left w-64">Info Jamaah</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-left w-64">Info Pinjaman</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-left w-[320px]">Detail Peminjaman</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-28">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <!-- State Loading -->
          <tr v-if="isLoading">
            <td colspan="5" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#455494]"></div>
              </div>
            </td>
          </tr>

          <!-- State Kosong -->
          <tr v-else-if="pinjamans.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-base text-gray-600">
              {{ searchQuery ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data pengguna' }}
            </td>
          </tr>

          <!-- Baris Data -->
          <tr
            v-for="pinjaman in pinjamans"
            :key="pinjaman.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Nomor Register -->
            <td class="px-6 py-4 text-left align-top text-sm font-medium text-gray-700">
              {{ pinjaman.register_number }}
            </td>

            <!-- Info Jamaah -->
            <td class="px-6 py-4 text-left align-top space-y-2 text-sm text-gray-600">
              <div class="flex justify-between w-full">
                <span>Nama Jamaah</span>
                <span class="font-semibold text-gray-800">{{ pinjaman.nama_jamaah }}</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Nomor Identitas</span>
                <span>{{ pinjaman.identity_number }}</span>
              </div>
            </td>

            <!-- Info Pinjaman -->
            <td class="px-6 py-4 text-left align-top space-y-2 text-sm text-gray-600">
              <div class="flex justify-between w-full">
                <span>Jumlah Peminjaman</span>
                <span>{{ formatIDR(pinjaman.nominal) }}</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Jumlah DP</span>
                <span>{{ formatIDR(pinjaman.dp) }}</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Tenor</span>
                <span>{{ pinjaman.tenor }} Bulan</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Biaya Perbulan</span>
                <span>{{ formatIDR(pinjaman.nominal_skema) }}</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Sudah Bayar</span>
                <span>{{ formatIDR(pinjaman.total_bayar) }}</span>
              </div>
              <div class="flex justify-between w-full">
                <span>Status Peminjaman</span>
                <span class="capitalize">
                  {{ pinjaman.status_peminjaman.replace('_', ' ') }}
                </span>
              </div>
            </td>

            <!-- Detail Peminjaman (kosong / bisa diganti tabel nested) -->
            <td class="px-6 py-4 text-left align-top text-sm text-gray-600">
              <!-- Contoh nested tabel jika ingin -->
              <table class="w-full border border-gray-200 text-xs">
                <thead>
                  <tr class="bg-gray-100">
                    <th colspan="4" class="px-2 py-1 text-center">Riwayat Pembayaran Pinjaman</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-2 py-1">Invoice</td>
                    <td class="px-2 py-1">Biaya</td>
                    <td class="px-2 py-1">Status</td>
                    <td class="px-2 py-1">Action</td>
                  </tr>
                  <tr v-for="detail in pinjaman.details" :key="detail.id">
                    <td class="px-2 py-1">{{ detail.tanggal }}</td>
                    <td class="px-2 py-1">{{ formatIDR(detail.jumlah) }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Tombol Aksi -->
            <td class="px-6 py-4 text-center align-top">
              <div class="flex justify-center gap-2">
                <EditButton @click="" title="Edit Pengguna">
                  <EditIcon />
                </EditButton>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Footer Pagination -->
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-left border min-h-[200px]" :colspan="5">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li>

                  <li
                    v-for="page in visiblePages"
                    :key="page"
                    v-if="pinjamans.length > 0 && !isLoading"
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

  <!-- Modal Konfirmasi Hapus -->
  <Confirmation
    :showConfirmDialog="showDeleteConfirmDialog"
    confirmTitle="Konfirmasi Hapus"
    confirmMessage="Apakah Anda yakin ingin menghapus pengguna ini?"
  >
    <button
      @click=""
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

  <!-- Form Tambah Peminjaman -->
  <FormAddPeminjaman :modalTambahPinjaman="modalTambahPinjaman" @close="handleAddPinjaman()" />

  <!-- Notifikasi -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarPinjaman } from '@/service/daftar_pinjaman'
import DeleteIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/EditIcon.vue'

// Import komponen lainnya
import DangerButton from '@/components/User/Modules/DaftarPeminjaman/Particle/DangerButton.vue'
import EditButton from '@/components/User/Modules/DaftarPeminjaman/Particle/EditButton.vue'
import Notification from '@/components/User/Modules/DaftarPeminjaman/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarPeminjaman/Particle/Confirmation.vue'
import FormAddPeminjaman from '@/components/User/Modules/DaftarPeminjaman/Particle/FormAddPeminjaman.vue'

// Data State
const pinjamans = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const maxVisiblePages = 5
const isLoading = ref(false)

const modalTambahPinjaman = ref(false)
const isModalOpen = ref(false)
const penggunaToUpdate = ref(null)
const showDeleteConfirmDialog = ref(false)
const userIdToDelete = ref<number | null>(null)
const showFormAddModal = ref(false)
const showAddPenggunaModal = ref(false)

// Notifikasi State
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

  // Adjust jika hampir di awal
  if (startPage < 1) {
    startPage = 1
    endPage = Math.min(maxVisiblePages, totalPages.value)
  }

  // Adjust jika hampir di akhir
  if (endPage > totalPages.value) {
    endPage = totalPages.value
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const formatIDR = (nominal: number) => {
  return nominal.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })
}

// Lifecycle Hook
onMounted(() => {
  fetchPinjaman()
})

onUnmounted(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

// Fetch Data Peminjaman
const fetchPinjaman = async () => {
  isLoading.value = true

  try {
    const response = await daftarPinjaman({
      search: searchQuery.value,
      perpage: itemsPerPage.value,
      pageNumber: currentPage.value,
    })
    totalPages.value = Math.ceil(response.total / itemsPerPage.value)
    pinjamans.value = response.data
  } catch (error) {
    console.error('Error fetching pinjaman:', error)
    showNotification.value = true
    notificationMessage.value = 'Gagal memuat data pinjaman'
    notificationType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  if (timeoutId.value) clearTimeout(timeoutId.value)

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const showConfirmDialog = ref<boolean>(false)

const confirmMessage = ref<string>('')
const confirmTitle = ref<string>('')
const confirmAction = ref<(() => void) | null>(null)

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

// Handle Search
const handleSearch = () => {
  currentPage.value = 1
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = window.setTimeout(() => {
    fetchPinjaman()
  }, 500)
}

// Handle Pagination
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPinjaman()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPinjaman()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  fetchPinjaman()
}

// Menampilkan Modal Tambah Peminjaman
const bukaModalPeminjaman = () => {
  modalTambahPinjaman.value = true
}

// Menutup Modal Tambah Peminjaman
const handleAddPinjaman = () => {
  modalTambahPinjaman.value = false
  displayNotification('Peminjaman berhasil ditambahkan', 'success')
  fetchPinjaman()
}
</script>

<style scoped>
/* Anda dapat menambahkan gaya CSS khusus untuk komponen ini di sini */
</style>
