<template>
  <div class="container mx-auto p-4">
    <!-- Header dengan Add User dan Search -->
    <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <!-- Tombol Tambah Peminjaman -->
      <PrimaryButton @click="bukaModalPeminjaman()"><IconPlus></IconPlus> Tambah Peminjaman</PrimaryButton>
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
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">No. Register</th>
            <th class="w-[20%] px-6 py-4 font-bold text-gray-900 text-center w-64">Info Jamaah</th>
            <th class="w-[25%] px-6 py-4 font-bold text-gray-900 text-center w-64">
              Info Pinjaman
            </th>
            <th class="w-[40%] px-6 py-4 font-bold text-gray-900 text-center w-[320px]">
              Detail Peminjaman
            </th>
            <th class="w-[5%] px-6 py-4 font-bold text-gray-900 text-center w-28">Aksi</th>
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
              <table class="w-full">
                <tbody>
                  <tr>
                    <td class="w-[50%]">Nama Jamaah</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">{{ pinjaman.nama_jamaah }}</td>
                  </tr>
                  <tr>
                    <td>Nomor Identitas</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">
                      {{ pinjaman.identity_number }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Info Pinjaman -->
            <td class="px-6 py-4 text-left align-top space-y-2 text-sm text-gray-600">
              <table class="w-full">
                <tbody>
                  <tr>
                    <td class="w-[50%]">Jumlah Peminjaman</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">
                      {{ formatIDR(pinjaman.nominal) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah DP</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">{{ formatIDR(pinjaman.dp) }}</td>
                  </tr>
                  <tr>
                    <td>Tenor</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">{{ pinjaman.tenor }} Bulan</td>
                  </tr>
                  <tr>
                    <td>Biaya Perbulan</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">
                      {{ formatIDR(pinjaman.nominal_skema) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Sudah Bayar</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">
                      {{ formatIDR(pinjaman.total_bayar) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Status Peminjaman</td>
                    <td>:</td>
                    <td class="text-right space-y-2 text-sm py-1">
                      {{ pinjaman.status_peminjaman.replace('_', ' ') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Detail Peminjaman (kosong / bisa diganti tabel nested) -->
            <td class="px-6 py-4 text-left align-top text-sm text-gray-600">
              <!-- Contoh nested tabel jika ingin -->
              <table class="w-full border border-gray-200 text-xs">
                <thead>
                  <tr class="bg-gray-100">
                    <th colspan="4" class="px-2 py-2 text-center">RIWAYAT PEMBAYARAN PEMINJAMAN</th>
                  </tr>
                  <tr>
                    <th class="w-[25%] px-2 py-2 border font-bold text-center">#Invoice</th>
                    <th class="w-[40%] px-2 py-2 border font-bold text-center">Biaya</th>
                    <th class="w-[20%] px-2 py-2 border font-bold text-center">Status</th>
                    <th class="w-[15%] px-2 py-2 border font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="pinjaman.riwayat_pembayaran.length > 0">
                    <tr v-for="detail in pinjaman.riwayat_pembayaran" :key="detail.id">
                      <td class="px-2 py-2 text-center">{{ detail.invoice }}</td>
                      <td class="px-2 py-2 text-center">{{ formatIDR(detail.nominal) }}</td>
                      <td class="px-2 py-2 text-center">{{ detail.status }}</td>
                      <td class="px-2 py-2"></td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td class="px-2 py-2 text-center" colspan="4">
                      Riwayat pembayaran pinjaman tidak ditemukan
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Tombol Aksi -->
            <td class="px-2 py-2 text-center align-top">
              <div class="flex flex-wrap justify-center gap-1 max-w-[64px] mx-auto">
                <LightButton  @click="">
                  <CetakIcon class="w-4 h-4" />
                </LightButton>
                <LightButton  @click="
                    bukaModalBayar({
                      id: pinjaman.id,
                      riwayat_pembayaran: pinjaman.riwayat_pembayaran,
                    })
                  " title="Pembayaran Cicilan"
                  class="p-1 w-6 h-6">
                    <BayarIcon class="w-4 h-4" />
                </LightButton>
                <LightButton  @click="handleModalUpdate(pinjaman.id)"
                  title="Edit Skema Cicilan"
                  class="p-1 w-6 h-6">
                <EditIcon class="w-4 h-4" />
                </LightButton>
                <DangerButton @click="" title="Hapus Peminjaman" class="p-1 w-6 h-6">
                  <DeleteIcon class="w-4 h-4" />
                </DangerButton>
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
  <FormAddPeminjaman
    :modalTambahPinjaman="modalTambahPinjaman"
    @close="handleAddPinjaman()"
    @tutup="modalTambahPinjaman = false"
  />

  <!-- Notifikasi -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />

  <FormPembayaran
    :isOpen="showFormPembayaranModal"
    :peminjaman="peminjamanData"
    @close="handleBayarPinjaman"
  />

  <FormUpdateSkema
    v-if="showFormUpdateModal"
    @close="showFormUpdateModal = false"
    :peminjamanId="peminjamanId"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarPinjaman } from '@/service/daftar_pinjaman'
import DeleteIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/EditIcon.vue'
import CetakIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/CetakIcon.vue'
import CetakButton from '@/components/User/Modules/DaftarPeminjaman/Particle/CetakButton.vue'
import BayarIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/BayarIcon.vue'
import BayarButton from '@/components/User/Modules/DaftarPeminjaman/Particle/BayarButton.vue'
// Import komponen lainnya

import DangerButton from '@/components/User/Modules/DaftarPeminjaman/Particle/DangerButton.vue'
import EditButton from '@/components/User/Modules/DaftarPeminjaman/Particle/EditButton.vue'
import Notification from '@/components/User/Modules/DaftarPeminjaman/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarPeminjaman/Particle/Confirmation.vue'
import FormAddPeminjaman from '@/components/User/Modules/DaftarPeminjaman/widget/FormAddPeminjaman.vue'
import FormUpdateSkema from '@/components/User/Modules/DaftarPeminjaman/widget/FormUpdateSkema.vue'
import FormPembayaran from '@/components/User/Modules/DaftarPeminjaman/widget/FormPembayaran.vue'

// Button
import LightButton from "@/components/Button/LightButton.vue"
import PrimaryButton from "@/components/Button/PrimaryButton.vue"
// Icon
import IconPlus from "@/components/Icons/IconPlus.vue"


// Interface untuk Type Safety
interface Pinjaman {
  id: number
  register_number: string
  nama_jamaah: string
  identity_number: string
  nominal: number
  dp: number
  tenor: number
  nominal_skema: number
  total_bayar: number
  status_peminjaman: string
  riwayat_pembayaran: Array<{
    id: number
    invoice: string
    nominal: number
    status: string
  }>
}

// Data State
const pinjamans = ref<Pinjaman[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const maxVisiblePages = 5
const isLoading = ref(false)
const peminjamanId = ref(0)

// Modal State
const modalTambahPinjaman = ref(false)
const showDeleteConfirmDialog = ref(false)
const showFormUpdateModal = ref(false)
const showFormPembayaranModal = ref(false)

// Notifikasi State
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

const handleModalUpdate = (id: number) => {
  peminjamanId.value = id // Set dulu id-nya
  showFormUpdateModal.value = true // Baru buka modal
  console.log(peminjamanId.value)
}

const handleBayarPinjaman = () => {
  showFormPembayaranModal.value = false
  displayNotification('Berhasil Bayar Pinjaman', 'success')
  fetchPinjaman()
}

const handleUpdate = async () => {
  showFormUpdateModal.value = false
  displayNotification('Peminjaman berhasil diupdate', 'success')
}

// Computed Properties
const visiblePages = computed(() => {
  const pages = []
  const halfVisible = Math.floor(maxVisiblePages / 2)

  let startPage = Math.max(1, currentPage.value - halfVisible)
  let endPage = Math.min(totalPages.value, currentPage.value + halfVisible)

  // Adjust jika visible pages kurang dari maxVisiblePages
  if (endPage - startPage + 1 < maxVisiblePages) {
    if (currentPage.value < totalPages.value / 2) {
      endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
    } else {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// Format Currency
const formatIDR = (nominal: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominal)
}

// Fetch Data Peminjaman
const fetchPinjaman = async () => {
  isLoading.value = true
  pinjamans.value = []

  try {
    const response = await daftarPinjaman({
      search: searchQuery.value,
      perpage: itemsPerPage.value,
      pageNumber: currentPage.value,
    })

    // Debugging response
    console.log('API Response:', response)

    // Handle berbagai kemungkinan struktur response
    if (response && (response.data || response)) {
      const data = response.data || response
      pinjamans.value = Array.isArray(data) ? data : data.data || []
      totalItems.value = data.total || data.length || 0
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1
    } else {
      throw new Error('Format response tidak valid')
    }
  } catch (error) {
    console.error('Error fetching pinjaman:', error)
    displayNotification('Gagal memuat data pinjaman: ' + (error as Error).message, 'error')
    pinjamans.value = []
    totalPages.value = 1
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

// Notifikasi
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Handle Search dengan debounce
const handleSearch = () => {
  currentPage.value = 1
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = window.setTimeout(() => {
    fetchPinjaman()
  }, 500)
}

// Pagination
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
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchPinjaman()
  }
}

// Modal
const bukaModalPeminjaman = () => {
  modalTambahPinjaman.value = true
}

const peminjamanData = ref({})

const bukaModalBayar = (data) => {
  peminjamanData.value = data
  showFormPembayaranModal.value = true
}

const handleAddPinjaman = () => {
  modalTambahPinjaman.value = false
  displayNotification('Peminjaman berhasil ditambahkan', 'success')
  fetchPinjaman()
}

// Lifecycle Hooks
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
</script>

<style scoped>
/* Style tetap sama */
</style>
