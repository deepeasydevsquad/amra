<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <!-- Button Tambah Deposit -->
      <button
        @click="ConfirmJamaahModal()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-fit"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v6m3-3h-6m-4 4a4 4 0 100-8 4 4 0 000 8zm0 0c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z"
          />
        </svg>
        Tambah Jamaah
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
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Nomor Identitas</th>
            <th class="w-[30%] px-6 py-4 font-bold text-gray-900 text-center">Nama Jamaah</th>
            <th class="w-[30%] px-6 py-4 font-bold text-gray-900 text-center">Nomor Passport</th>
            <th class="w-[20%] px-6 py-4 font-bold text-gray-900 text-center">
              Tempat Tanggal Lahir
            </th>
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
          <tr v-else-if="jamaah.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-base text-gray-600">
              {{ searchQuery ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data deposit' }}
            </td>
          </tr>

          <!-- Deposit Data -->
          <tr
            v-for="jamaahs in jamaah"
            :key="jamaahs.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-center">{{ jamaahs.nomor_identitas || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ jamaahs.nama_jamaah || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ jamaahs.nomor_passport || '-' }}</td>
            <td class="px-6 py-4 text-center">{{ jamaahs.tempat_tanggal_lahir || '-' }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <DangerButton @click="confirmDelete(jamaahs.id)" title="Print Invoice">
                  <DeleteIcon />
                </DangerButton>
                <EditButton @click="handleFormUpdate(jamaahs)" title="Edit Jamaah">
                  <EditIcon />
                </EditButton>
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
                    v-if="jamaah.length > 0 && !isLoading"
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

  <FormAddNew v-if="showFormAdd" :defaultData="selectedMemberData" @close="showFormAdd = false" @next="handleNext" />

<FormAddNew
  v-if="showFormAdd"
  :defaultData="selectedMemberData"
  @close="showFormAdd = false"
  @success="handleJamaahSuccess"
/>


  <FormAddMember 
  v-if="showFormAddMember"
  @close = 'showFormAddMember = false'
  @next="handleNextStep"
  />

<FormMember
  v-if="showFormMember"
  :defaultData="selectedMemberData"
  @close="showFormMember = false"
  @success="handleJamaahSuccess"
/>

<FormUpdate 
v-if="ShowFormUpdate"
 :jamaah="selectedJamaah"
@close="ShowFormUpdate = false"
@update="updateSuccess"
/>

  <!-- Delete Confirmation Modal -->
  <Confirmation
    :showConfirmDialog="showDeleteConfirmDialog"
    confirmTitle="Konfirmasi Hapus"
    confirmMessage="Apakah Anda yakin ingin menghapus Jamaah ini?"
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



 <ModalConfirm ref="jamaahModal" @pilih-baru="handleNewJamaah" @pilih-member="handleFromMember" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarJamaah, deleteJamaah } from '@/service/daftar_jamaah.ts'
import Confirmation from '@/components/user/modules/DaftarJamaah/Particle/Confirmation.vue'
import Notification from '@/components/user/modules/DaftarJamaah/Particle/Notification.vue'
import DeleteIcon from '@/components/user/modules/DaftarJamaah/Icon/DeleteIcon.vue'
import DangerButton from '@/components/user/modules/DaftarJamaah/Particle/DangerButton.vue'
import EditIcon from '@/components/user/modules/DaftarJamaah/Icon/EditIcon.vue'
import EditButton from '@/components/user/modules/DaftarJamaah/Particle/EditButton.vue'
import ModalConfirm from '@/components/user/modules/DaftarJamaah/Particle/ModalConfirm.vue'
import FormAddNew from '@/components/user/modules/DaftarJamaah/Particle/FormAddNew.vue'
import FormAddMember from '@/components/user/modules/DaftarJamaah/Particle/FormAddMember.vue'
import FormMember from '@/components/user/modules/DaftarJamaah/Particle/FormMember.vue'
import FormUpdate from '@/components/user/modules/DaftarJamaah/Particle/FormUpdate.vue'






const ShowFormUpdate = ref(false)
const selectedJamaah = ref(null) // <-- buat simpen data jamaah yg mau diedit

const handleFormUpdate = async (jamaah: any) => {
  selectedJamaah.value = jamaah
  ShowFormUpdate.value = true
}


// Reactive State
const jamaah = ref([])
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
const showFormAddMember = ref(false)
const jamaahModal = ref()


const jamaahIdToDelete = ref('')

const confirmDelete = (id: number) => {
  jamaahIdToDelete.value = id
  showDeleteConfirmDialog.value = true
}


const executeDelete = async () => {
  if (!jamaahIdToDelete.value) return // Pastikan jamaahIdToDelete terisi

  try {
    // Kirimkan jamaahIdToDelete sebagai member_id ke API
    const response = await deleteJamaah({ member_id: jamaahIdToDelete.value })
    displayNotification(response.error_msg || 'Jamaah berhasil dihapus', 'success')

    fetchJamaah() // Refresh data jamaah
  } catch (error) {
    console.error('Gagal menghapus Jamaah:', error)
    displayNotification('Gagal menghapus Jamaah', 'error')
  } finally {
    showDeleteConfirmDialog.value = false
    jamaahIdToDelete.value = null // Reset jamaahIdToDelete setelah selesai
  }
}


function ConfirmJamaahModal() {
  jamaahModal.value?.openModal()
}
function handleNewJamaah() {
  showFormAdd.value = true
  showFormAddMember.value = false  // Pastikan hanya satu form yang ditampilkan
}

function handleFromMember() {
   console.log('Modal pilih member dipilih');
  showFormAddMember.value = true
  showFormAdd.value = false  // Pastikan hanya satu form yang ditampilkan
}

const updateSuccess = async (data: any) => {
  ShowFormUpdate.value = false
  fetchJamaah()
  displayNotification('Jamaah berhasil di update', 'success')
}

const handleJamaahSuccess = () => {
  showFormAdd.value = false
  showFormMember.value = false
  fetchJamaah() // Refresh data
  displayNotification('Jamaah berhasil ditambahkan', 'success')
}

const showFormMember = ref(false)
const selectedMemberData = ref(null)

const handleNextStep = (formData: any) => {
  if (!formData) {
    displayNotification("Data tidak valid", "error");
    return;
  }
  
  // Setelah validasi sukses, simpan data yang dipilih dan lanjutkan ke FormMember
  selectedMemberData.value = formData; // Isi data yang dipilih
  showFormAddMember.value = false;  // Sembunyikan FormAddNew
  showFormMember.value = true;  // Tampilkan FormMember
};


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

const fetchJamaah = async () => {
  isLoading.value = true
  try {
    const response = await daftarJamaah({
      pageNumber: currentPage.value,
      search: searchQuery.value,
      perpage: itemsPerPage.value,
    })

    jamaah.value = response.data || []
    console.log('Data jamaah:', jamaah.value)
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1

    // Adjust current page if it's out of bounds
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await fetchJamaah() // Refetch with corrected page
      return
    }
  } catch (error) {
    console.error('Gagal memuat data Jamaah:', error)
    displayNotification('Gagal memuat data Jamaah', 'error')
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

  fetchJamaah()

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
    fetchJamaah()
  }
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)



// Lifecycle Hooks
onMounted(() => {
  fetchJamaah()
})

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
})
</script>
