<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between mb-4 items-center gap-4">
      <!-- Container tombol-tombol -->
      <div class="flex gap-3">
        <button
          @click="modalTambahSurat()"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2"
        >
          <!-- icon PDF -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 2a2 2 0 00-2 2v16c0 1.103.897 2 2 2h12a2 2 0 002-2V8l-6-6H6z" />
            <path
              fill="#fff"
              d="M9 13h1v3H9v-3zm2.5 0h.75c.276 0 .5.224.5.5v2c0 .276-.224.5-.5.5H11.5v-3zm2 0H15a1 1 0 010 2h-.5v1H13.5v-3z"
            />
            <path d="M13 3.5V9h5.5L13 3.5z" />
          </svg>
          Cetak Surat
        </button>

        <button
          @click="showModalKonfigurasi()"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.25 2.25c.414 0 .75.336.75.75v1.086a7.5 7.5 0 012.95 1.27l.769-.77a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.061l-.77.77a7.5 7.5 0 011.27 2.949h1.086a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.086a7.5 7.5 0 01-1.27 2.949l.77.77a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061 0l-.77-.77a7.5 7.5 0 01-2.949 1.27v1.086a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.086a7.5 7.5 0 01-2.949-1.27l-.77.77a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 010-1.061l.77-.77a7.5 7.5 0 01-1.27-2.949H2.25a.75.75 0 01-.75-.75v-1.5c0-.414.336-.75.75-.75h1.086a7.5 7.5 0 011.27-2.949l-.77-.77a.75.75 0 010-1.061l1.061-1.06a.75.75 0 011.06 0l.77.77A7.5 7.5 0 0110.5 4.086V3c0-.414.336-.75.75-.75zM12 15a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
          Konfigurasi Surat
        </button>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-2 min-w-[200px] max-w-sm">
        <label for="search" class="block text-sm font-medium text-gray-700">Filter</label>
        <input
          v-model="searchQuery"
          id="search"
          type="text"
          placeholder="Cari Surat"
          class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>

    <div v-else class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[15%]">Nomor Surat</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[15%]">Tipe Surat</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[40%]">Info</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[15%]">Tujuan</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[10%]">Petugas</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[20%]">Tanggal Surat</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center w-[15%]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="!paginatedRiwayat || paginatedRiwayat.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">Data tidak ada</td>
          </tr>
          <tr
            v-for="riwayatSurat in paginatedRiwayat"
            :key="riwayatSurat.nomor_surat"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-center font-bold">{{ riwayatSurat.nomor_surat }}</td>
            <td class="px-6 py-4 text-center">
              {{ formatTipeSurat(riwayatSurat.tipe_surat) }}
            </td>
            <td class="px-6 py-4 text-center">
              <div v-if="riwayatSurat.tipe_surat === 'surat_cuti'">
                <!-- Misahin info surat_cuti -->
                <div v-for="(line, index) in riwayatSurat.info.text.split(',')" :key="index">
                  {{ line.trim() }}
                </div>
              </div>

              <div v-else-if="riwayatSurat.tipe_surat === 'rekom_paspor'">
                <!-- Misahin info rekom_paspor -->
                <div v-for="(line, index) in riwayatSurat.info.text.split(',')" :key="index">
                  {{ line.trim() }}
                </div>
              </div>

              <div v-else>
                {{ riwayatSurat.info }}
              </div>
            </td>

            <td class="px-6 py-4 text-center">{{ riwayatSurat.tujuan }}</td>
            <td class="px-6 py-4 text-center">{{ riwayatSurat.nama_petugas }}</td>
            <td class="px-6 py-4 text-center">{{ formatDate(riwayatSurat.tanggal_surat) }}</td>
            <td class="px-6 py-4 text-center">
              <LightButton
                @click="handleDownload(riwayatSurat.info.jamaah_id, riwayatSurat.tipe_surat)"
                title="Cetak Surat"
                class="p-1 w-6 h-6"
              >
                <CetakIcon class="w-4 h-4" />
              </LightButton>
              <DangerButton @click="" title="Hapus Surat" class="p-1 w-6 h-6">
                <DeleteIcon class="w-4 h-4" />
              </DangerButton>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100">
          <tr>
            <td colspan="7" class="px-4 py-4 text-left">
              <nav class="flex justify-left">
                <ul class="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                  </li>
                  <li v-for="page in pages" :key="page">
                    <button
                      @click="pageNow(page)"
                      :class="
                        currentPage === page
                          ? 'bg-[#333a48] text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-100'
                      "
                      class="px-3 py-2 border border-gray-300"
                    >
                      {{ page }}
                    </button>
                  </li>
                  <li>
                    <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
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

  <ModalKonfigurasi
    :show="modalKonfigurasi"
    @close="closeModalKonfigurasi"
    @konfigurasi_success="handleKonfigurasi"
  />
  <!-- Notification Popup -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  ></Notification>
  <ModalTambahSurat
    :formtambahsurat="showModalTambahSurat"
    @close="closeModalTambahSurat"
    @handletambahsurat="handleTambahSurat"
  />

  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <button
      @click="confirmAction && confirmAction()"
      class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Ya
    </button>
    <button
      @click="showConfirmDialog = false"
      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Tidak
    </button>
  </Confirmation>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DeleteIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/DeleteIcon.vue'
import Confirmation from '@/components/User/Modules/DaftarPaketLa/Particle/Confirmation.vue'
import CetakIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/CetakIcon.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import LightButton from '@/components/Button/LightButton.vue'
import Notification from '@/components/User/Modules/DaftarProviderVisa/Particle/Notification.vue'
import { getRiwayatSurat } from '@/service/daftar_konfigurasi_surat'
import ModalTambahSurat from '@/components/User/Modules/DaftarSuratMenyurat/widgets/ModalTambahSurat.vue'
import ModalKonfigurasi from '@/components/User/Modules/DaftarSuratMenyurat/widgets/ModalKonfigurasi.vue'

const riwayatSurat = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 100
const modalKonfigurasi = ref(false)
const showModalTambahSurat = ref(false)
const timeoutId = ref<number | null>(null)
const dataProviderVisa = ref<ProviderVisa[]>([])
const isModalOpen = ref<boolean>(false)
const showNotification = ref<boolean>(false)
const showConfirmDialog = ref<boolean>(false)
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'error'>('success')
const confirmMessage = ref<string>('')
const confirmTitle = ref<string>('')
const confirmAction = ref<(() => void) | null>(null)
const totalColumns = ref(3) // Default 3 kolom

const handleTambahSurat = () => {
  showModalTambahSurat.value = false
  displayNotification('Surat Menyurat berhasil ditambahkan', 'success')
  fetchRiwayatSurat()
}

const modalTambahSurat = () => {
  showModalTambahSurat.value = true
}

const closeModalTambahSurat = () => {
  showModalTambahSurat.value = false
}

const showModalKonfigurasi = () => {
  modalKonfigurasi.value = true
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

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

const handleDownload = async (jamaah_id: number, tipe_surat: string) => {
  showConfirmation('Konfirmasi Cetak', 'Apakah Anda yakin ingin mencetak surat ini?', async () => {
    try {
      const jenisSurat = tipe_surat
      const jamaahId = jamaah_id

      const url = `${window.location.origin}/cetak_surat/${jenisSurat}?jamaah_id=${jamaahId}`
      window.open(url, '_blank')
      showConfirmDialog.value = false
    } catch (error) {
      console.error('Error deleting data:', error)
      displayNotification('Terjadi kesalahan saat Mencetak Surat.', 'error')
    }
  })
}

const handleKonfigurasi = () => {
  modalKonfigurasi.value = false
  displayNotification('Konfugurasi berhasil', 'success')
}

const closeModalKonfigurasi = () => {
  modalKonfigurasi.value = false
}

const fetchRiwayatSurat = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await getRiwayatSurat()
    riwayatSurat.value = data
    console.log('Riwayat Surat:', riwayatSurat.value)
  } catch (err) {
    console.error(err)
    error.value = 'Gagal mengambil data riwayat surat. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

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

const formatTipeSurat = (tipe: string) => {
  return tipe
    .replace(/_/g, ' ') // ganti underscore jadi spasi
    .split(' ') // pisah tiap kata
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // kapital tiap awal kata
    .join(' ') // gabung lagi pake spasi
}

const filteredRiwayat = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return (riwayatSurat.value || []).filter(
    (r) =>
      r.nomor_surat?.toLowerCase().includes(search) ||
      r.tipe_surat?.toLowerCase().includes(search) ||
      r.info?.toLowerCase().includes(search) ||
      r.tujuan?.toLowerCase().includes(search) ||
      r.petugas?.toLowerCase().includes(search),
  )
})

const totalPages = computed(() => Math.ceil(filteredRiwayat.value.length / itemsPerPage))
const paginatedRiwayat = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRiwayat.value.slice(start, end)
})

const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
const pageNow = (page: number) => (currentPage.value = page)
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++
const prevPage = () => currentPage.value > 1 && currentPage.value--

onMounted(() => {
  fetchRiwayatSurat()
})
</script>

<style scoped></style>
