<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMember, deleteMember as deleteMemberApi } from '@/service/member'
import { daftarCabang, getInfoMember } from "@/service/member"
import { userTypes } from "@/service/param_cabang"
import DeleteIcon from '@/components/User/Modules/Member/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/Member/Icon/EditIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
// import DangerButton from '@/components/User/Modules/Member/Particle/DangerButton.vue'
// import EditButton from '@/components/User/Modules/Member/Particle/EditButton.vue'
import FormAddUpdate from '@/components/User/Modules/Member/Particle/FormAddUpdate.vue'
// import FormUpdate from '@/components/User/Modules/Member/Particle/FormUpdate.vue'
import Notification from '@/components/User/Modules/Member/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/Member/Particle/Confirmation.vue'
// import AddAgenButton from '@/components/User/Modules/Member/Particle/AddAgenButton.vue'
import AddAgenIcon from '@/components/User/Modules/Member/Icon/AddAgenIcon.vue'
import FormAddAgen from '@/components/User/Modules/Member/Particle/FormAddAgen.vue'

import LightButton from "@/components/Button/LightButton.vue"
import DangerButton from "@/components/Button/DangerButton.vue"
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

//sas
////
interface Members {
  id: number
  fullname: string
  identity_number: string
  gender: string
  whatsapp_number: string,
  status_agen:boolean;
  status_jamaah:boolean;
  status_staff:boolean;
}

interface Cabang {
  id: number
  name: string
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
const cabangs = ref<Cabang[]>([])
const AddAgenForm = ref(false)
const UserType = ref('');

const addAgen = async (id: number) => {
  const member = members.value.find((m) => m.id === id)
  if (member) {
    selectedMember.value = { ...member }
    console.log('data yang di kirim ke add Agen Form', selectedMember.value)
    AddAgenForm.value = true
  }
}

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
  return 6
})



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

// Fungsi untuk mengambil data cabang
const fetchCabang = async (): Promise<void> => {
  try {
    const response = await daftarCabang()
    cabangs.value = response.data
    console.log('Data cabang:', response.data)
  } catch (error) {
    console.error('Gagal fetch data cabang:', error)
  }
}

const fetchUserType = async (): Promise<void> => {
  try {
    const response = await userTypes()
    UserType.value = response.data
    console.log('Data cabang:', response.data)
  } catch (error) {
    console.error('Gagal fetch data cabang:', error)
  }
}

const fetchMemberInfo = async (id: number): Promise<void> => {
  try {
    const response = await getInfoMember(id)
    // cabangs.value = response.data
    console.log('Data member:', response.data)
  } catch (error) {
    console.error('Gagal fetch data member:', error)
  }
}

// Fungsi untuk menampilkan form add
const AddForm = () => {
  fetchUserType();
  fetchCabang();
  // get cabang
  showAddForm.value = true
}

// Fungsi untuk edit dan delete
const editMember = (id: number) => {
   fetchCabang();

  fetchMemberInfo(id)

  showAddForm.value = true
  // const member = members.value.find((m) => m.id === id)
  // if (member) {
  //   selectedMember.value = { ...member }
  //   console.log(selectedMember.value)
  //   showUpdateForm.value = true
  // }
}

const closeAddForm = () => {
  showAddForm.value = false
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
    <div class="flex justify-between mb-4" >

      <PrimaryButton @click="AddForm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Member
      </PrimaryButton>

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

    <!-- Tabel Data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr class="bg-gray-100">
            <th class="w-[25%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nomor Identitas</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Jenis Kelamin</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">WhatsApp</th>
            <th class="w-[20%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Status</th>
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="paginatedMembers.length" class="divide-y divide-gray-100 border-t border-gray-100" >
          <tr v-for="member in paginatedMembers" :key="member.id" >
            <td class="px-6 py-4 text-center">{{ member.fullname }}</td>
            <td class="px-6 py-4 text-center">{{ member.identity_number }}</td>
            <td class="px-6 py-4 text-center">{{ member.gender === 'laki_laki' ? 'Laki - Laki' : ( member.gender === 'perempuan' ? 'Perempuan' : '-' ) }} </td>
            <td class="px-6 py-4 text-center">{{ member.whatsapp_number }}</td>
            <td class="px-6 py-4 text-center">
              <span class="bg-blue-100 text-blue-800 text-xs font-bold me-2 px-3 py-1.5 rounded-lg dark:bg-blue-900 dark:text-blue-300">Member</span>
              <span v-if="member.status_staff === true" class="bg-blue-100 text-blue-800 text-xs font-bold me-2 px-3 py-1.5 rounded-lg dark:bg-blue-900 dark:text-blue-300">Staff</span>
              <span v-if="member.status_agen === true" class="bg-blue-100 text-blue-800 text-xs font-bold me-2 px-3 py-1.5 rounded-lg dark:bg-blue-900 dark:text-blue-300">Agen</span>
              <span v-if="member.status_jamaah === true" class="bg-blue-100 text-blue-800 text-xs font-bold me-2 px-3 py-1.5 rounded-lg dark:bg-blue-900 dark:text-blue-300">Jamaah</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <LightButton @click="editMember(member.id)" class="p-2 "><EditIcon /></LightButton>
                <LightButton v-if="member.status_agen === false"  @click="addAgen(member.id)" class="p-2 "><AddAgenIcon /></LightButton>
                <DangerButton @click="confirmDelete(member.id)" class="p-2 "><DeleteIcon /></DangerButton>
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
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow" />
        </tfoot>
      </table>
    </div>
  </div>

  <Confirmation :showConfirmDialog="showConfirmDialog" :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
    <button @click="confirmAction" class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Ya
    </button>
    <button @click="showConfirmDialog = false" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Tidak
    </button>
  </Confirmation>

  <!-- Notification Popup -->
  <Notification :showNotification="showNotification" :notificationType="'success'" :notificationMessage="'Data berhasil disimpan!'" @closeNotification="showNotification = false" />

  <FormAddUpdate :showForm="showAddForm" @save="refreshTable" @cancel="closeAddForm" :cabangs="cabangs" />

  <!-- Modal Update Member -->


  <!-- <FormUpdate :showUpdateForm="showUpdateForm" :member="selectedMember" @save="editMember" @cancel="closeUpdateForm" /> -->

  <FormAddAgen
    v-if="AddAgenForm"
    :member="selectedMember"
    @close="AddAgenForm = false"
    :isOpen="AddAgenForm"
  />
</template>
