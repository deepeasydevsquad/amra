<script setup lang="ts">
// Import Icon
import EditIcon from '@/components/User/Modules/KamarPaket/Icon/EditIcon.vue'
import DeleteIcon from '@/components/User/Modules/KamarPaket/Icon/DeleteIcon.vue'
import IconDownload from '@/components/User/Modules/KamarPaket/Icon/IconDownload.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'

// import element
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import Notification from '@/components/User/Modules/KamarPaket/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/KamarPaket/Particle/Confirmation.vue'

// Import form pop-up
import FormAdd from '@/components/User/Modules/KamarPaket/Widget/FormAdd.vue'
import FormEdit from '@/components/User/Modules/KamarPaket/Widget/FormEdit.vue'

import { getDaftarKamarPaket, deleteKamar } from '@/service/kamar_paket'
import { ref, onMounted, computed } from 'vue'

// --- State ---
const itemsPerPage = 10
const currentPage = ref(1)
const search = ref('')
const totalPages = ref(0)
const totalColumns = ref(0)
const isEditFormOpen = ref<boolean>(false)
const editingKamarId = ref<number | null>(null)

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

const pageNow = (page: number) => {
  currentPage.value = page
  fetchData()
}

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const showConfirmDialog = ref<boolean>(false)
const showNotification = ref<boolean>(false)
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'error'>('success')
const confirmMessage = ref<string>('')
const confirmTitle = ref<string>('')
const confirmAction = ref<(() => void) | null>(null)

const kamarList = ref<Kamar[]>([])
const isFormOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

interface JamaahDetail {
  nama: string
  no_identity: string
  tipe_paket: string
}
interface Kamar {
  id: number
  tipe_kamar: string
  hotel_name: string
  kapasitas_kamar: number
  daftar_jamaah: JamaahDetail[]
  nama_kota: string
}

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await getDaftarKamarPaket({
      search: search.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    })

    if (response && response.error) {
      displayNotification(response.error_msg || 'Terjadi kesalahan saat mengambil data', 'error')
      return
    }

    totalPages.value = Math.ceil((response?.total || 0) / itemsPerPage)
    kamarList.value = response?.data || []
  } catch (error) {
    console.error('Error fetching data:', error)
    if (error instanceof Error) {
      displayNotification(`Error: ${error.message}`, 'error')
    } else {
      displayNotification('Gagal mengambil data. Silakan coba lagi.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  setTimeout(() => {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
  }, 100)
}

const handleSaveSuccess = (message: string) => {
  displayNotification(message, 'success')
  fetchData()
}

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

const deleteItem = async (id: number) => {
  try {
    const response = await deleteKamar(id)

    if (response && response.error) {
      displayNotification(response.message || 'Gagal menghapus data.', 'error')
    } else {
      displayNotification(response.message || 'Data kamar berhasil dihapus.', 'success')
      fetchData()
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menghapus data.'
    displayNotification(errorMessage, 'error')
  } finally {
    showConfirmDialog.value = false
  }
}

const handleDelete = (id: number) => {
  showConfirmation('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus data kamar ini?', () =>
    deleteItem(id),
  )
}

const handleEdit = (id: number) => {
  editingKamarId.value = id
  isEditFormOpen.value = true
}

const handleConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value()
  }
  showConfirmDialog.value = false
}

const handleCancelConfirm = () => {
  showConfirmDialog.value = false
}

const handleDownload = () => {
  const url = '/download-daftar-kamar'
  window.open(url, '_blank')
}

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchData()
  setTimeout(() => {
    totalColumns.value = document.querySelectorAll('thead th').length
  }, 0)
})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <div class="flex gap-2">
        <PrimaryButton @click="isFormOpen = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Tambah Kamar
        </PrimaryButton>
        <button
          type="button"
          @click="handleDownload"
          class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
        >
          <IconDownload class="w-5 h-5 mr-2" />
          <span>Download Daftar Kamar</span>
        </button>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label for="search" class="text-sm font-medium text-gray-700">Filter:</label>
        <div class="relative w-full sm:w-72">
          <input
            type="text"
            id="search"
            class="w-full pl-3 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            v-model="search"
            @input="fetchData"
            placeholder="Cari nama atau nomor id jamaah..."
            style="font-size: 0.9rem"
          />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table
        class="w-full border-collapse bg-white text-center text-base justify-center text-gray-700"
      >
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-base">Tipe Kamar</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-base">Kapasitas Kamar</th>
            <th class="w-[45%] px-6 py-4 font-bold text-gray-900 text-base">Daftar Jamaah</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-base">Nama Kota</th>
            <th class="w-[10%] px-6 py-4 font-bold text-center text-gray-900 text-base">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <tr v-if="isLoading">
            <td :colspan="totalColumns || 5" class="px-6 py-6 text-center">
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="kamarList.length === 0">
            <td :colspan="totalColumns || 5" class="px-6 py-6 text-center text-gray-500">
              {{ search ? 'Data tidak ditemukan' : 'Belum ada data kamar' }}
            </td>
          </tr>
          <tr v-for="item in kamarList" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 align-top">
              <div class="font-bold">{{ item.tipe_kamar }}</div>
              <div class="text-sm text-gray-500">(Hotel: {{ item.hotel_name }})</div>
            </td>
            <td class="px-6 py-4 align-top text-center">{{ item.kapasitas_kamar }} Orang</td>
            <td class="px-6 py-4 align-top">
              <ul v-if="item.daftar_jamaah.length > 0" class="space-y-2">
                <li
                  v-for="jamaah in item.daftar_jamaah"
                  :key="jamaah.no_identity"
                  class="flex items-start justify-between"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-gray-500">&#x1F464;</span>
                    <div class="font-medium text-gray-800">{{ jamaah.nama }}</div>
                  </div>
                  <div class="text-sm text-gray-500 text-right">
                    <div class="mb-3">No Identity: {{ jamaah.no_identity }}</div>
                    <div class="border-b border-gray-200"></div>
                    <div class="mt-3">Tipe Paket: {{ jamaah.tipe_paket }}</div>
                  </div>
                </li>
              </ul>
              <span v-else class="text-gray-400 italic">Belum ada jamaah</span>
            </td>
            <td class="px-6 py-4 align-top">{{ item.nama_kota }}</td>
            <td class="px-6 py-4 flex items-start justify-center gap-2">
              <LightButton title="Edit" @click="handleEdit(item.id)">
                <EditIcon class="h-4 w-4 text-gray-600" />
              </LightButton>
              <DangerButton title="Delete" @click="handleDelete(item.id)">
                <DeleteIcon class="w-5 h-5" />
              </DangerButton>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :pages="pages"
            :total-columns="totalColumns"
            @prev-page="prevPage"
            @next-page="nextPage"
            @page-now="pageNow"
          />
        </tfoot>
      </table>
    </div>

    <Notification
      v-if="showNotification"
      :show-notification="showNotification"
      :notification-message="notificationMessage"
      :notification-type="notificationType"
      @close="showNotification = false"
    />

    <Confirmation
      v-if="showConfirmDialog"
      :show-confirm-dialog="showConfirmDialog"
      :confirm-title="confirmTitle"
      :confirm-message="confirmMessage"
      @close="handleCancelConfirm"
    >
      <button
        type="button"
        class="w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleConfirm"
      >
        Hapus
      </button>
      <button
        type="button"
        class="mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleCancelConfirm"
      >
        Batal
      </button>
    </Confirmation>

    <FormAdd
      v-if="isFormOpen"
      :is-form-open="isFormOpen"
      @close="isFormOpen = false"
      @save-success="handleSaveSuccess"
      @show-notification="displayNotification"
    />

    <FormEdit
      v-if="isEditFormOpen"
      :is-form-open="isEditFormOpen"
      :kamar-id="editingKamarId"
      @close="isEditFormOpen = false"
      @save-success="handleSaveSuccess"
      @show-notification="displayNotification"
    />
  </div>
</template>
