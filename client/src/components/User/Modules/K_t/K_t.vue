<script setup lang="ts">
// Import icon
import XIcon from '@/components/User/Modules/SyaratPaket/icon/XIcon.vue'
import CheckIcon from '@/components/User/Modules/SyaratPaket/icon/CheckIcon.vue'

// Import components
import Notification from '@/components/User/Modules/SyaratPaket/particle/Notification.vue'

import LightButton from "@/components/Button/LightButton.vue"
import IconPlus from '@/components/Icons/IconPlus.vue'

// import widget
import Pagination from '@/components/Pagination/Pagination.vue'

import { ref, onMounted, computed } from 'vue'
import { daftarSyaratPaket } from '@/service/syarat_paket'

const props = defineProps<{
  paketId: number
}>()

const isLoading = ref(false)
const itemsPerPage = 100 // Jumlah daftar transaksi per halaman
const currentPage = ref(1)
const search = ref('')
const totalPages = ref(0)
const timeoutId = ref<number | null>(null)

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

interface SyaratPaket {
  id: number
  jamaah_id: number
  fullname: string
  identity_number: string
  gender: string
  status_syarat: { [key: string]: boolean }
}

const dataSyaratPaket = ref<SyaratPaket[]>([])
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'error'>('success')
const showNotification = ref<boolean>(false)
const totalColumns = ref(3)

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  if (timeoutId.value) clearTimeout(timeoutId.value)

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await daftarSyaratPaket({
      paketId: props.paketId,
      search: search.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    })
    dataSyaratPaket.value = response.data
    console.log(dataSyaratPaket)
    totalPages.value = Math.ceil(response.total / itemsPerPage)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4 bg-white min-h-screen">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
    </div>
    <!-- Tambah data dan Search -->
    <!-- <div class="flex justify-end mb-4">
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Cari Jamaah..."
        />
      </div>
    </div> -->
    <div class="flex justify-between mb-4">
      <button class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <DownloadIcon />
        Tutup Paket
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Cari Jamaah..."
        />
      </div>
    </div>

    <div class="overflow-hidden  border border-gray-200">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <tbody>
          <tr>
            <td class="w-[25%] px-6 py-2 border-b font-medium text-gray-900 text-start">RINCIAN KEGIATAN ANGGARAN PAKET</td>
            <td class="w-[2%] px-0 py-2 border-b font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">123123</td>
          </tr>
          <tr>
            <td class="px-6 py-2 border-b font-medium text-gray-900 text-start">RINCIAN AKTUALISASI BELANJA PAKET</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">123123</td>
          </tr>
          <tr>
            <td class="px-6 py-2 font-medium text-gray-900 text-start">RINCIAN KEUNTUNGAN PROGRAM PAKET</td>
            <td class="px-0 py-2 font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 font-medium text-gray-900 text-start">123123</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="overflow-hidden  border border-gray-200 mt-10">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[3%] px-6 py-3 font-medium text-gray-900 text-center">No</th>
            <th class="w-[30%] px-6 py-3 font-medium text-gray-900 text-center">Uraian</th>
            <th class="w-[3%] px-6 py-3 font-medium text-gray-900 text-center">Qt</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Biaya</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Biaya Mahram</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Diskon</th>
            <th class="w-[13%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Biaya</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td></td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">POTENSI PENDAPATAN PAKET</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
          <tr>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">NORMAL</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="overflow-hidden  border border-gray-200 mt-10">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <tbody>
          <tr class="border-b bg-gray-50">
            <td class="w-[3%] px-6 py-3 font-medium text-gray-900 text-center">A.</td>
            <td colspan="5" class="px-0 py-3 font-medium text-gray-900 text-left">POTENSI PENDAPATAN PAKET</td>
            <td class="w-[13%] px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="w-[15%] px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">1</td>
            <td colspan="5" class="px-0 py-3 font-medium text-gray-900 text-left">Pembayaran Jamaah</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">2</td>
            <td colspan="5" class="px-0 py-3 font-medium text-gray-900 text-left">Diskon</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">3</td>
            <td colspan="5" class="px-0 py-3 font-medium text-gray-900 text-left">Piutang Jamaah</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">-</td>
          </tr>
          <tr class="border-b bg-gray-50">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">B.</td>
            <td colspan="5" class="px-0 py-3 font-medium text-gray-900 text-left">AKTUALISASI KEGIATAN ANGGARAN</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">
              <div class="flex justify-center">
                <LightButton><IconPlus/></LightButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[25%] px-6 py-3 font-medium text-gray-900 text-center">Jamaah</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Jenis Kelamin</th>
            <th class="w-[60%] px-6 py-3 font-medium text-gray-900 text-center">Syarat-syarat</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataSyaratPaket && dataSyaratPaket.length > 0">
            <tr v-for="dataSyarat in dataSyaratPaket" :key="dataSyarat.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">
                <p>{{ dataSyarat.fullname }}</p>
                <p>({{ dataSyarat.identity_number }})</p>
              </td>
              <td class="px-6 py-4 text-center">{{ dataSyarat.gender }}</td>
              <td class="px-6 py-4">
                <ul class="grid grid-cols-4 gap-2">
                  <li
                    v-for="(value, key) in dataSyarat.status_syarat"
                    :key="key"
                    class="flex items-center space-x-2"
                  >
                    <span v-if="value" class="text-green-500"><CheckIcon class="w-5 h-5" /></span>
                    <span v-else class="text-red-500"><XIcon class="w-5 h-5" /></span>
                    <span>{{ key }}</span>
                  </li>
                </ul>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="totalColumns" class="px-6 py-4 text-center text-sm text-gray-600">
              Daftar Syarat Tidak Ditemukan.
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
    </div> -->
  </div>

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
