<script setup lang="ts">
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import LightButton from '@/components/Button/LightButton.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { get_paket_agen } from '@/service/pembayaran_fee_agen_paket'
import { ref, onMounted, computed } from 'vue'
import FormPembayaran from '../Particle/FormPembayaran.vue'
import Notification from '../Particle/Notification.vue'
import { paramCabang } from '@/service/param_cabang'
import Cabang from '../../Cabang/Cabang.vue'

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')
const timeoutId = ref<number | null>(null)

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

const PembayaranSuccess = () => {
  modalPembayaran.value = false
  displayNotification('Pembayaran berhasil', 'success')
}

const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(0)
const total = ref(0)
const totalColumns = ref(4)
const data = ref<data[]>([])

interface data {
  agen_id: number
  member_fullname: string
  member_identity_number: string | number
  member_whatsapp_number: string
  total_fee_lunas: number
  total_fee_belum_lunas: number
  jumlah_transaksi: number
}

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetch_data()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetch_data()
  }
}

const pageNow = (page: number) => {
  currentPage.value = page
  fetch_data()
}

const fetch_data = async () => {
  try {
    const response = await get_paket_agen({
      search: searchQuery.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
      cabang: selectedOptionCabang.value,
    })
    total.value = response.total
    data.value = response.data
    totalPages.value = Math.ceil(total.value / itemsPerPage)
  } catch (error) {
    console.log(error)
  }
}

const formatRupiah = (angka: number | string): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(angka))
}

const modalPembayaran = ref(false)
const agen_id = ref(0)

const openModalPembayaran = (id: number) => {
  modalPembayaran.value = true
  agen_id.value = id
}

interface filterCabang {
  id: number
  name: string
}

const selectedOptionCabang = ref(0)
const optionFilterCabang = ref<filterCabang[]>([])
const searchQuery = ref('')

const fetchFilterData = async () => {
  const response = await paramCabang()
  optionFilterCabang.value = response.data
  selectedOptionCabang.value = response.data[0].id
  await fetch_data()
}

onMounted(fetchFilterData)
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <!-- Tambahin wrapper dengan flex justify-end -->
    <div class="w-full flex justify-end mb-4">
      <div class="inline-flex rounded-md shadow-xs" role="group">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2 mt-3">Filter</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-s-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="searchQuery"
          @change="fetch_data()"
          placeholder="Cari data..."
        />
        <select
          v-model="selectedOptionCabang"
          style="width: 300px"
          @change="fetch_data()"
          class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
            {{ optionC.name }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
    <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
      <thead class="bg-gray-100">
        <tr>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">INFO AGEN</th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[20%]">
            No WhatsApp
          </th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">
            INFO TRANSAKSI
          </th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[10%]">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="border-b border-gray-100 hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b text-left align-top">
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Nama</span>: {{ item.member_fullname }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">NIK</span>:
              {{ item.member_identity_number }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">WhatsApp</span>:
              {{ item.member_whatsapp_number }}
            </div>
          </td>
          <td class="px-4 py-2 border-b text-center align-top">
            <div class="py-1">
              {{ item.member_whatsapp_number }}
            </div>
          </td>
          <td class="px-4 py-2 border-b text-left align-top">
            <div class="py-1">
              <span class="inline-block w-40 font-bold">Fee Sudah Dibayar</span>:
              {{ formatRupiah(item.total_fee_lunas) }}
            </div>
            <div class="py-1">
              <span class="inline-block w-40 font-bold">Fee Belum Dibayar</span>:
              {{ formatRupiah(item.total_fee_belum_lunas) }}
            </div>
            <div class="py-1">
              <span class="inline-block w-40 font-bold">Total Transaksi</span>:
              {{ item.jumlah_transaksi }}
            </div>
          </td>
          <td class="px-4 py-4 text-center align-top flex justify-center items-center">
            <LightButton @click="openModalPembayaran(item.agen_id)">
              <i class="pi pi-money-bill"></i>
            </LightButton>
          </td>
        </tr>

        <tr v-if="!data.length">
          <td :colspan="totalColumns" class="text-center text-gray-400 py-6">
            Data tidak tersedia
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

  <FormPembayaran
    :formStatus="modalPembayaran"
    :agen_id="agen_id"
    @cancel="modalPembayaran = false"
    @close="modalPembayaran = false"
    @submitted="
      () => {
        fetch_data()
        PembayaranSuccess()
      }
    "
  />

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
