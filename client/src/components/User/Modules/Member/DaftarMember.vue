<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMember, deleteMember as deleteMemberApi } from '@/service/member'
import DeleteIcon from '@/components/User/Modules/Member/icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/Member/icon/EditIcon.vue'
import DangerButton from '@/components/User/Modules/Member/Particle/DangerButton.vue'
import EditButton from '@/components/User/Modules/Member/Particle/EditButton.vue'
import FormAdd from '@/components/User/Modules/Member/Particle/FormAdd.vue'
import FormUpdate from '@/components/User/Modules/Member/Particle/FormUpdate.vue'
import Notification from '@/components/User/Modules/Member/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/Member/Particle/Confirmation.vue'

interface Members {
  id: number;
  fullname: string;
  identity_number: string;
  gender: string;
  whatsapp_number: string;
}

// State
const members = ref<Members[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const showAddForm = ref(false)
const showUpdateForm = ref(false)
const selectedMember = ref(null)
const showConfirmDialog = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref(() => {})
const showNotification = ref(false)
const notificationType = ref('')
const notificationMessage = ref('')

// Fetch data
const fetchMember = async () => {
  try {
    const response = await getMember()
    members.value = response.data
  } catch (error) {
    console.error('Gagal fetch data member:', error)
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Gagal fetch data member'
  }
}

onMounted(() => {
  fetchMember()
})

const refreshTable = () => {
  fetchMember()
}

// Filter data berdasarkan pencarian
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  return members.value.filter((member) =>
    member.fullname.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredMembers.value.length / itemsPerPage) || 1)
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredMembers.value.slice(start, start + itemsPerPage)
})

// Fungsi buat dapetin daftar halaman dengan angka di tengah
const pages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisiblePages = 5 // Jumlah halaman maksimal yang terlihat

  if (total <= maxVisiblePages) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - Math.floor(maxVisiblePages / 2))
  let end = start + maxVisiblePages - 1

  if (end > total) {
    end = total
    start = total - maxVisiblePages + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Fungsi pindah halaman
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const pageNow = (page: number) => {
  currentPage.value = page
}

// Ambil jumlah kolom agar `colspan` dinamis
const totalColumns = computed(() => {
  return  5
})

// Fungsi untuk edit dan delete
const editMember = (id: number) => {
  const member = members.value.find((m) => m.id === id)
  if (member) {
    selectedMember.value = { ...member }
    console.log(selectedMember.value)
    showUpdateForm.value = true
  }
}

const confirmDelete = (id: number) => {
  confirmTitle.value = 'Hapus Member'
  confirmMessage.value = 'Apakah Anda yakin ingin menghapus member ini?'
  confirmAction.value = async () => {
    try {
      await deleteMemberApi(id)
      members.value = members.value.filter((m) => m.id !== id)
      showConfirmDialog.value = false
      showNotification.value = true
      notificationType.value = 'success'
      notificationMessage.value = 'Member berhasil dihapus'
    } catch (error) {
      console.error('Gagal menghapus member:', error)
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Gagal menghapus member'
    }
  }
  showConfirmDialog.value = true
}

// Fungsi untuk menampilkan form add
const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
}

// Fungsi untuk menutup form update
const closeUpdateForm = () => {
  showUpdateForm.value = false
  selectedMember.value = null
  fetchMember()
}
</script>
<template>

    <div class="container mx-auto p-4">
      <!-- Tambah data dan Search -->
      <div class="flex justify-between mb-4" v-if="!showAddForm && !showUpdateForm">
        <button
          @click="toggleAddForm"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#2c3240] transition-colors duration-200 ease-in-out flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Member
        </button>
        <div class="flex items-center">
          <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
          <input
            type="text"
            v-model="searchQuery"
            id="search"
            class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Cari data..."
          />
        </div>
      </div>

      <!-- Form Add -->

      <!-- Tabel Data -->
      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr class="bg-gray-100">
              <th class="px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama</th>
              <th class="px-6 py-4 font-medium font-bold text-gray-900 text-center">
                Nomor Identitas
              </th>
              <th class="px-6 py-4 font-medium font-bold text-gray-900 text-center">
                Jenis Kelamin
              </th>
              <th class="px-6 py-4 font-medium font-bold text-gray-900 text-center">WhatsApp</th>
              <th class="px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="paginatedMembers.length" class="divide-y divide-gray-100 border-t border-gray-100">
            <tr v-for="member in paginatedMembers" :key="member.id" class="bg-gray-100">
              <td class="px-6 py-4 text-center">{{ member.fullname }}</td>
              <td class="px-6 py-4 text-center">{{ member.identity_number }}</td>
              <td class="px-6 py-4 text-center">
                {{
                  member.gender === 'laki_laki'
                    ? 'Laki - Laki'
                    : member.gender === 'perempuan'
                      ? 'Perempuan'
                      : '-'
                }}
              </td>
              <td class="px-6 py-4 text-center">{{ member.whatsapp_number }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <EditButton @click="editMember(member.id)"><EditIcon /></EditButton>
                  <DangerButton @click="confirmDelete(member.id)"><DeleteIcon /></DangerButton>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-gray-100 border-t border-gray-100">
            <tr>
              <td :colspan="totalColumns" class="px-6 py-4 text-center text-gray-500">
                Daftar Member Tidak di Temukan {{ totalColumns }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 font-bold">
            <tr>
              <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="totalColumns">
                <nav class="flex mt-0 justify-start">
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
                    <li v-for="page in pages" :key="page" v-if="paginatedMembers.length">
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

  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <button
      @click="confirmAction"
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
  <Notification
    :showNotification="showNotification"
    :notificationType="'success'"
    :notificationMessage="'Data berhasil disimpan!'"
    @closeNotification="showNotification = false"
  />

  <!-- Modal Tambah Member -->
  <div
    v-if="showAddForm"
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-4/5 lg:w-1/2 max-h-[85vh] h-auto overflow-y-auto relative mt-25 mb-5"
    >
      <!-- Tombol Close -->
      <button
        @click="toggleAddForm"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>

      <!-- Form Tambah -->
      <FormAdd @save="refreshTable" @cancel="toggleAddForm" />
    </div>
  </div>

  <!-- Modal Update Member -->
  <div
    v-if="showUpdateForm"
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
  >
    <div
      class="bg-white p-6 shadow-lg w-11/12 md:w-4/5 lg:w-1/2 max-h-[85vh] h-auto overflow-y-auto relative mt-25 mb-5"
    >
      <!-- Tombol Close -->
      <button
        @click="closeUpdateForm"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>

      <!-- Form Update -->
      <FormUpdate :member="selectedMember" @save="editMember" @cancel="closeUpdateForm" />
    </div>
  </div>
</template>
