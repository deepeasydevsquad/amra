<script setup lang="ts">
// Import Icon
import DeleteIcon from './Icon/DeleteIcon.vue'
import EditIcon from './Icon/EditIcon.vue'

// import element
import DangerButton from './Particle/DangerButton.vue'
import EditButton from './Particle/EditButton.vue'
import Notification from './Particle/Notification.vue'
import Confirmation from './Particle/Confirmation.vue'

// import api from "@/services/api"; // Import service API
import { daftarKostumerPaketLA, addKostumerPaketLA, editKostumerPaketLA, deleteKostumerPaketLA } from '../../../../service/daftar_kostumer_paket_la' // Import function POST
import { ref, onMounted, computed, watchEffect } from 'vue'
import axios from 'axios'

const itemsPerPage = 100 // Jumlah kostumerpaketla per halaman
const currentPage = ref(1)
const search = ref('')
const pageNumber = ref(0)
const totalPages = ref(0)

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

// Generate array angka halaman
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

interface KostumerPaketLA {
  id: number
  name: string
  mobile_number: string
  address: string
}

interface Errors {
  name: string
  mobile_number: string
  address: string
}

const timeoutId = ref<number | null>(null)
const dataKostumerPaketLA = ref<KostumerPaketLA[]>([])
const isModalOpen = ref<boolean>(false)
const showNotification = ref<boolean>(false)
const showConfirmDialog = ref<boolean>(false)
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'error'>('success')
const confirmMessage = ref<string>('')
const confirmTitle = ref<string>('')
const confirmAction = ref<(() => void) | null>(null)
const totalColumns = ref(5) // Default 3 kolom

const selectedKostumerPaketLA = ref<Partial<KostumerPaketLA>>({
  name: '',
  mobile_number: '',
  address: '',
})

const errors = ref<Errors>({
  name: '',
  mobile_number: '',
  address: '',
})

const fetchData = async () => {
  const response = await daftarKostumerPaketLA({
    search: search.value,
    perpage: itemsPerPage,
    pageNumber: currentPage.value,
  })
  totalPages.value = Math.ceil(response.total / itemsPerPage)
  dataKostumerPaketLA.value = response.data
}

const openModal = (kostumerpaketla?: KostumerPaketLA) => {
  selectedKostumerPaketLA.value = kostumerpaketla ? { ...kostumerpaketla } : { name: '', mobile_number: '', address: '' }
  isModalOpen.value = true
}

onMounted(async () => {
  await fetchData() // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll('thead th').length
})

const validateForm = (): boolean => {
  errors.value = { name: '', mobile_number: '', address: '' }
  let isValid = true

  if (!selectedKostumerPaketLA.value.name?.trim()) {
    errors.value.name = 'Nama tidak boleh kosong'
    isValid = false
  }

  if (!selectedKostumerPaketLA.value.mobile_number?.trim()) {
    errors.value.mobile_number = 'Nomor HP tidak boleh kosong'
    isValid = false
  }

  if (!selectedKostumerPaketLA.value.address?.trim()) {
    errors.value.address = 'Alamat tidak boleh kosong'
    isValid = false
  }

  return isValid
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

const saveData = async () => {
  if (!validateForm()) return

  const isEdit = !!selectedKostumerPaketLA.value.id
  const action = async () => {
    try {
      if (isEdit) {
        const response = await editKostumerPaketLA(selectedKostumerPaketLA.value.id, selectedKostumerPaketLA.value)
        showConfirmDialog.value = false
        displayNotification(response.error_msg)
      } else {
        const response = await addKostumerPaketLA(selectedKostumerPaketLA.value)
        showConfirmDialog.value = false
        displayNotification(response.error_msg)
      }
      isModalOpen.value = false
      fetchData()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        displayNotification(
          error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.',
          'error',
        )
      } else {
        displayNotification('Terjadi kesalahan yang tidak terduga.', 'error')
      }
      showConfirmDialog.value = false
    }
  }

  isEdit
    ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action)
    : action()
}

const deleteData = async (id: number) => {
  showConfirmation('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus data ini?', async () => {
    try {
      const response = await deleteKostumerPaketLA(id)
      showConfirmDialog.value = false
      displayNotification(response.error_msg)
      fetchData()
    } catch (error) {
      console.error('Error deleting data:', error)
      displayNotification('Terjadi kesalahan saat menghapus data.', 'error')
    }
  })
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <button
        @click="openModal()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Kostumer
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Cari data..."
        />
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
           <th class="w-[50%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama Kostumer</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nomor HP</th>
            <th class="w-[35%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Alamat</th>
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataKostumerPaketLA && dataKostumerPaketLA.length > 0">
            <tr v-for="kostumerpaketla in dataKostumerPaketLA" :key="kostumerpaketla.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">{{ kostumerpaketla.name }}</td>
              <td class="px-6 py-4 text-center">{{ kostumerpaketla.mobile_number }}</td>
              <td class="px-6 py-4 text-center">{{ kostumerpaketla.address }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <EditButton @click="openModal(kostumerpaketla)">
                    <EditIcon></EditIcon>
                  </EditButton>
                  <DangerButton @click="deleteData(kostumerpaketla.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="4" class="px-6 py-4 text-center text-base text-gray-600">
              Daftar kostumer paket la tidak ditemukan.
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="totalColumns">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px">
                  <!-- Tombol Previous -->
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg
                        hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li>
                  <!-- Nomor Halaman -->
                  <li v-for="page in pages" :key="page">
                    <button
                      @click="pageNow(page)"
                      class="px-3 py-2 leading-tight border"
                      :class="currentPage === page
                        ? 'text-white bg-[#3a477d] border-[#3a477d]'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'"
                    >
                      {{ page }}
                    </button>
                  </li>

                  <!-- Tombol Next -->
                  <li>
                    <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg
                        hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Modal Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="isModalOpen = false"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">
                {{ selectedKostumerPaketLA.id ? "Edit Data Kostumer" : "Tambah Kostumer Baru" }}
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    v-model="selectedKostumerPaketLA.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Nama Kostumer"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                  <input
                    v-model="selectedKostumerPaketLA.mobile_number"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Nomor HP"
                  />
                  <p v-if="errors.mobile_number" class="mt-1 text-sm text-red-600">{{ errors.mobile_number }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    v-model="selectedKostumerPaketLA.address"
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Alamat"
                  ></textarea>
                  <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="saveData"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ selectedKostumerPaketLA.id ? "Simpan Perubahan" : "Tambah" }}
              </button>
              <button
                @click="isModalOpen = false"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Dialog -->
    <Confirmation  :showConfirmDialog="showConfirmDialog"  :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
      <button @click="confirmAction && confirmAction()"
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

    <!-- Notification Popup -->
    <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification>
  </div>
</template>
