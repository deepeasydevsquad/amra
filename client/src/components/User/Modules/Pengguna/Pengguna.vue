<template>
  <div class="container mx-auto p-4">
    <!-- Header with Add User and Search -->
    <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <!-- Add User Button -->
      <button
        @click="isConfirmationModalVisible = true"
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
        Tambah Pengguna
      </button>

      <!-- Search Input -->
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

    <!-- User Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 font-bold text-gray-900 text-center">Nama</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center">Nama Cabang</th>
            <th class="px-6 py-4 font-bold text-gray-900 text-center">Nama Grup</th>
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
          <tr v-else-if="users.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-base text-gray-600">
              {{ searchQuery ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data pengguna' }}
            </td>
          </tr>

          <!-- User Data -->
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-center">{{ user.Member?.fullname || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ user.Division?.name || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ user.Grup?.name || '-' }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <LightButton @click="editUser(user.id)" title="Edit Pengguna">
                  <EditIcon />
                </LightButton>
                <DangerButton @click="confirmDelete(user.id)" title="Hapus Pengguna">
                  <DeleteIcon />
                </DangerButton>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Pagination Footer -->
        <tfoot class="bg-gray-100 font-bold">
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow" />
        </tfoot>
      </table>
    </div>
  </div>

  <div
    v-if="showFormAddModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-bold text-gray-700 mb-4">Tambah Pengguna Baru</h2>
      <FormAdd @close="closeFormAddModal" @save="handleAddMember" />
    </div>
  </div>

  <!-- Pindahkan FormAddPengguna ke sini -->
  <div
    v-if="showAddPenggunaModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <FromAddPengguna
        v-model:isModalOpen="showAddPenggunaModal"
        @pengguna-added="handlePenggunaAdded"
      />
    </div>
  </div>

  <!-- Modals and Notifications -->
  <ConfirmTambah v-model:isVisible="isConfirmationModalVisible" :onConfirm="handleConfirmation" />

  <FormUpdatePengguna
    :isModalOpen="isModalOpen"
    :penggunaToUpdate="penggunaToUpdate"
    @update:isModalOpen="isModalOpen = $event"
    @pengguna-updated="handleUserUpdated"
  />

  <Confirmation
    :showConfirmDialog="showDeleteConfirmDialog"
    confirmTitle="Konfirmasi Hapus"
    confirmMessage="Apakah Anda yakin ingin menghapus pengguna ini?"
  >
    <button
      @click="executeDelete()"
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

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarPengguna, deletePengguna } from '../../../../service/pengguna'
import FormAdd from './Particle/FormAdd.vue'
import FromAddPengguna from './Particle/FormAddPengguna.vue'
import ConfirmTambah from './Particle/ConfirmTambah.vue'
import FormUpdatePengguna from './Particle/FormUpdatePengguna.vue'
import Confirmation from './Particle/Confirmation.vue'
import Notification from './Particle/Notification.vue'
import DeleteIcon from './Icon/DeleteIcon.vue'
import EditIcon from './Icon/EditIcon.vue'
// import DangerButton from './Particle/DangerButton.vue'
import EditButton from './Particle/EditButton.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import LightButton from "@/components/Button/LightButton.vue"
import DangerButton from "@/components/Button/DangerButton.vue"

// Data State
const users = ref([])
const searchQuery = ref('')
const totalItems = ref(0)
const isLoading = ref(false)

// Modal State
const isConfirmationModalVisible = ref(false)
const isModalOpen = ref(false)
const penggunaToUpdate = ref(null)
const showDeleteConfirmDialog = ref(false)
const userIdToDelete = ref<number | null>(null)
const showFormAddModal = ref(false)
const showAddPenggunaModal = ref(false)

// Notification State
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

// paging logic
const currentPage = ref(1)
const itemsPerPage = 100
const totalColumns = ref(4);
const totalPages = ref(0);

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});


const pageNow = (page : number) => {
  currentPage.value = page
  fetchData()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData()
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData()
  }
};


// Computed Properties
// const visiblePages = computed(() => {
//   const pages = []
//   const halfVisible = Math.floor(maxVisiblePages / 2)

//   let startPage = currentPage.value - halfVisible
//   let endPage = currentPage.value + halfVisible

//   // Adjust if we're near the start
//   if (startPage < 1) {
//     startPage = 1
//     endPage = Math.min(maxVisiblePages, totalPages.value)
//   }

//   // Adjust if we're near the end
//   if (endPage > totalPages.value) {
//     endPage = totalPages.value
//     startPage = Math.max(1, endPage - maxVisiblePages + 1)
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i)
//   }

//   return pages
// })

// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await daftarPengguna({
      page: currentPage.value,
      search: searchQuery.value,
      limit: itemsPerPage.value,
    })

    users.value = response.data || []
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1

    // Adjust current page if it's out of bounds
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await fetchData() // Refetch with corrected page
      return
    }
  } catch (error) {
    console.error('Gagal memuat data pengguna:', error)
    displayNotification('Gagal memuat data pengguna', 'error')
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
    fetchData()
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
    fetchData()
  }
}

// const nextPage = () => goToPage(currentPage.value + 1)
// const prevPage = () => goToPage(currentPage.value - 1)

// User Actions
const editUser = (id: number) => {
  penggunaToUpdate.value = users.value.find((user) => user.id === id)
  isModalOpen.value = true
}

const confirmDelete = (id: number) => {
  userIdToDelete.value = id
  showDeleteConfirmDialog.value = true
}

const executeDelete = async () => {
  if (!userIdToDelete.value) return

  try {
    const response = await deletePengguna(userIdToDelete.value)
    displayNotification(response.error_msg || 'Pengguna berhasil dihapus', 'success')

    // If we deleted the last item on the page, go back one page
    if (users.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    fetchData()
  } catch (error) {
    console.error('Gagal menghapus pengguna:', error)
    displayNotification('Gagal menghapus pengguna', 'error')
  } finally {
    showDeleteConfirmDialog.value = false
    userIdToDelete.value = null
  }
}

const handleUserUpdated = () => {
  fetchData()
  displayNotification('Data pengguna berhasil diperbarui', 'success')
}

// Modifikasi handleConfirmation
const handleConfirmation = (isConfirmed: boolean) => {
  isConfirmationModalVisible.value = false
  if (isConfirmed) {
    showAddPenggunaModal.value = true
  } else {
    showFormAddModal.value = true
  }
}

const closeFormAddModal = () => {
  showFormAddModal.value = false
}

// Tambahkan handler untuk event dari FormAdd
const handleAddMember = () => {
  closeFormAddModal()
  fetchData()
  displayNotification('Member berhasil ditambahkan', 'success')
}

// Tambahkan handler untuk event dari FormAddPengguna
const handlePenggunaAdded = () => {
  showAddPenggunaModal.value = false
  fetchData()
  displayNotification('Pengguna berhasil ditambahkan', 'success')
}

// Lifecycle Hooks
onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
