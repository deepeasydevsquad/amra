<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
      <div class="flex items-center gap-2"></div>
      <div class="flex items-center gap-0">
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Cari berdasarkan nama fasilitas..."
          class="w-64 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[30%] px-6 py-4 font-medium text-gray-900 text-center">Fasilitas</th>
            <th class="w-[30%] px-6 py-4 font-medium text-gray-900 text-center">Jumlah Stok</th>
            <th class="w-[30%] px-6 py-4 font-medium text-gray-900 text-center">
              Jumlah Stok Terjual
            </th>
            <th class="w-[10%] px-6 py-4 font-medium text-gray-900 text-center w-28">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="data.length > 0">
            <tr v-for="d in data" :key="d.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-center align-top text-sm font-medium text-gray-700">
                {{ d.name }}
              </td>
              <td class="px-6 py-4 text-center align-top space-y-2 text-sm text-gray-600">
                {{ d.jumlah_stok }} Unit
              </td>
              <td class="px-6 py-4 text-center align-top space-y-2 text-sm text-gray-600">
                {{ d.jumlah_stok_terjual }} Unit
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <LightButton
                    @click="openModalStock(d.id)"
                    title="Tambah Stok Fasilitas"
                    class="p-1 w-6 h-6"
                  >
                    <IconPlus class="w-4 h-4" />
                  </LightButton>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4" class="px-2 py-2 text-center align-top">
                Daftar Fasilitas Tidak Ditemukan
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            :pages="pages"
            :totalColumns="totalColumns"
            @prev-page="handlePrev"
            @next-page="handleNext"
            @page-now="handlePageNow"
            :totalRow="totalRow"
          />
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
  <!-- <FormAddPeminjaman
    :modalTambahPinjaman="modalTambahPinjaman"
    @close="handleAddPinjaman()"
    @tutup="modalTambahPinjaman = false"
  /> -->

  <!-- Notifikasi -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />

  <!-- v-if="ModalStock" -->

  <FormAdd
    :showForm="ModalStock"
    :idFasilitas="selectedFasilitasId"
    @close="ModalStock = false"
    @success="handleSuccess"
  />

  <!-- <FormPembayaran
    :isOpen="showFormPembayaranModal"
    :peminjaman="peminjamanData"
    @close="handleCloseBayarPinjaman"
    @success="handleSuccessBayarPinjaman"
  />

  <FormUpdateSkema
    v-if="showFormUpdateModal"
    @close="showFormUpdateModal = false"
    :peminjamanId="peminjamanId"
    @update="handleUpdate"
  /> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { daftarFasilitasStock } from '@/service/daftar_stock_fasilitas'

// import DeleteIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/DeleteIcon.vue'
// import EditIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/EditIcon.vue'
// import CetakIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/CetakIcon.vue'
// import CetakButton from '@/components/User/Modules/DaftarPeminjaman/Particle/CetakButton.vue'
// import BayarIcon from '@/components/User/Modules/DaftarPeminjaman/Icon/BayarIcon.vue'
// import BayarButton from '@/components/User/Modules/DaftarPeminjaman/Particle/BayarButton.vue'
// Import komponen lainnya

import Notification from '@/components/User/Modules/DaftarPeminjaman/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarPeminjaman/Particle/Confirmation.vue'
// import FormAddPeminjaman from '@/components/User/Modules/DaftarPeminjaman/widget/FormAddPeminjaman.vue'
// import FormUpdateSkema from '@/components/User/Modules/DaftarPeminjaman/widget/FormUpdateSkema.vue'
// import FormPembayaran from '@/components/User/Modules/DaftarPeminjaman/widget/FormPembayaran.vue'

// Button
import Pagination from '@/components/Pagination/Pagination.vue'
import LightButton from '@/components/Button/LightButton.vue'
// import PrimaryButton from '@/components/Button/PrimaryButton.vue'
// import DangerButton from '@/components/Button/DangerButton.vue'

import IconPlus from '@/components/Icons/IconPlus.vue'
import FormAdd from './widget/FormAdd.vue'
// import IconMoney from '@/components/Icons/IconMoney.vue'

const totalColumns = ref(4)

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const pageNow = (page: number) => {
  currentPage.value = page
  fetchData()
}

// interface Pinjaman {
//   id: number
//   register_number: string
//   nama_jamaah: string
//   identity_number: string
//   nominal: number
//   dp: number
//   tenor: number
//   nominal_skema: number
//   total_bayar: number
//   status_peminjaman: string
//   riwayat_pembayaran: Array<{
//     id: number
//     invoice: string
//     nominal: number
//     status: string
//   }>
// }

interface filterCabang {
  id: number
  name: string
}

// const selectedOptionCabang = ref(0)
// const optionFilterCabang = ref<filterCabang[]>([])

// const fetchFilterData = async () => {
//   const response = await paramCabang()
//   optionFilterCabang.value = response.data
//   selectedOptionCabang.value = response.data[0].id
//   await fetchData()
// }

interface Data {
  id: number
  name: string
  jumlah_stok: number
  jumlah_stok_terjual: number
}

const data = ref<Data[]>([])
const totalRow = ref(0)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const maxVisiblePages = 5
const isLoading = ref(false)
const peminjamanId = ref(0)

const modalTambahPinjaman = ref(false)
const showDeleteConfirmDialog = ref(false)
const showFormUpdateModal = ref(false)
const showFormPembayaranModal = ref(false)

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

// const visiblePages = computed(() => {
//   const pages = []
//   const halfVisible = Math.floor(maxVisiblePages / 2)

//   let startPage = Math.max(1, currentPage.value - halfVisible)
//   let endPage = Math.min(totalPages.value, currentPage.value + halfVisible)

//   if (endPage - startPage + 1 < maxVisiblePages) {
//     if (currentPage.value < totalPages.value / 2) {
//       endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
//     } else {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1)
//     }
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i)
//   }
//   return pages
// })

const formatIDR = (nominal: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominal)
}

const fetchData = async () => {
  try {
    const response = await daftarFasilitasStock({
      search: searchQuery.value,
      perpage: itemsPerPage.value,
      pageNumber: currentPage.value,
    })

    data.value = response.data || []
    totalRow.value = response.total
  } catch (error) {
    console.error('Error fetching pinjaman:', error)
    displayNotification('Gagal memuat data pinjaman: ' + (error as Error).message, 'error')
  } finally {
    isLoading.value = false
  }
}

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

const handleSearch = () => {
  currentPage.value = 1
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = window.setTimeout(() => {
    fetchData()
  }, 500)
}

// const prevPage = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--
//     fetchData()
//   }
// }

// const nextPage = () => {
//   if (currentPage.value < totalPages.value) {
//     currentPage.value++
//     fetchData()
//   }
// }

// const goToPage = (page: number) => {
//   if (page >= 1 && page <= totalPages.value) {
//     currentPage.value = page
//     fetchData()
//   }
// }

const handlePrev = () => {
  if (currentPage.value > 1) currentPage.value--
}
const handleNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const handlePageNow = (page: number) => {
  currentPage.value = page
}

const bukaModalPeminjaman = () => {
  modalTambahPinjaman.value = true
}

// const peminjamanData = ref({})

// const bukaModalBayar = (data) => {
//   peminjamanData.value = data
//   showFormPembayaranModal.value = true
// }

// const handleAddPinjaman = () => {
//   modalTambahPinjaman.value = false
//   displayNotification('Peminjaman berhasil ditambahkan', 'success')
//   fetchPinjaman()
// }

onMounted(() => {
  fetchData()
})

// onUnmounted(() => {
//   if (timeoutId.value) {
//     clearTimeout(timeoutId.value)
//   }
//   if (searchTimeout.value) {
//     clearTimeout(searchTimeout.value)
//   }
// })

const ModalStock = ref(false)
const selectedFasilitasId = ref<number | null>(null)
const openModalStock = (id: number) => {
  ModalStock.value = true
  selectedFasilitasId.value = id
}

const handleSuccess = () => {
  ModalStock.value = false
  displayNotification('Stok fasilitas berhasil ditambahkan', 'success')
  fetchData()
}
</script>

<style scoped></style>
