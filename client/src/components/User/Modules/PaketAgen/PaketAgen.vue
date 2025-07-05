<script setup lang="ts">
import Confirmation from '@/components/Modal/Confirmation.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'
import TextArea from '@/components/Form/TextArea.vue'
import Notification from '@/components/Modal/Notification.vue'
import InputReadonly from '@/components/Form/InputReadonly.vue'
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import IconDetail from '@/components/Icons/IconDetail.vue'
import CetakIcon from '@/components/Icons/CetakIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import NabungIcon from '@/components/User/Modules/TabunganUmrah/Icon/NabungIcon.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { on } from 'events'

import { get_paket_agen } from '@/service/paket_agen'

const showModalDetail = ref(false)
const showModal = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')
const showConfirmDialog = ref(false)
const confirmMessage = ref('')
const confirmTitle = ref('')
const confirmAction = ref<(() => void) | null>(null)
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

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

const pages = computed<number[]>(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})
const totalColumns = 5 // karena table punya 5 kolom

const searchQuery = ref('')

const handlePrev = () => {
  if (currentPage.value > 1) currentPage.value--
}
const handleNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const handlePageNow = (page: number) => {
  currentPage.value = page
}

const filteredData = computed(() => {
  console.log('Search:', searchQuery.value)
  console.log('Data:', data.value)

  if (!searchQuery.value) return data.value

  const keyword = searchQuery.value.toLowerCase()

  const result = data.value.filter(
    (item) =>
      item.nama_agen?.toLowerCase().includes(keyword) ||
      item.agen_id?.toString().includes(keyword) ||
      item.whatsapp_number?.includes(keyword) ||
      item.rekrutans?.some(
        (jamaah: any) =>
          jamaah.fullname?.toLowerCase().includes(keyword) ||
          jamaah.identity_number?.includes(keyword),
      ),
  )

  console.log('Filtered Result:', result)
  return result
})

const props = defineProps<{
  paketId: number
}>()
const data = ref<any[]>([]) // array kosong

const fetchData = async () => {
  try {
    const response = await get_paket_agen({ paket_id: props.paketId })
    data.value = response.data
    console.log(data.value)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
  searchQuery.value = ''
})
</script>

<template>
  <div class="container mx-auto p-4 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <div class="flex justify-end items-center w-full">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
          placeholder="Cari Agen..."
        />
      </div>
    </div>
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">Info Agen</th>
            <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">Info Jamaah</th>
            <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[15%]">Fee</th>
            <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[15%]">Sudah Bayar</th>
            <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[10%]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="filteredData.length === 0">
            <td colspan="5" class="text-center py-3 text-sm text-gray-500">Daftar Agen Tidak Ditemukan</td>
          </tr>
          <tr
            v-for="item in filteredData"
            :key="item.agen_id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Info Agen -->
            <!-- Info Agen -->
            <td class="px-6 py-4 align-top">
              <div class="flex gap-x-2">
                <div class="space-y-1">
                  <div>Nama Agen</div>
                  <div>No Identitas</div>
                  <div>Level</div>
                  <div>No WA</div>
                </div>
                <div class="space-y-1">
                  <div>: {{ item.nama_agen }}</div>
                  <div>: {{ item.agen_id }}</div>
                  <div>: {{ item.level_keagenan }}</div>
                  <div>: {{ item.whatsapp_number }}</div>
                </div>
              </div>
            </td>

            <!-- Info Jamaah -->
            <td class="px-6 py-4 align-top">
              <div v-for="jamaah in item.rekrutans" :key="jamaah.id" class="flex gap-x-2 mb-3">
                <div class="space-y-1">
                  <div>Nama Jamaah</div>
                  <div>No Identitas</div>
                </div>
                <div class="space-y-1">
                  <div>: {{ jamaah.fullname }}</div>
                  <div>: {{ jamaah.identity_number }}</div>
                </div>
              </div>
            </td>

            <!-- Fee -->
            <td class="text-center px-6 py-4 align-top">
              Rp {{ (item.total_belum_lunas ?? 0).toLocaleString() }}
            </td>

            <!-- Sudah Bayar -->
            <td class="text-center px-6 py-4 align-top">
              Rp {{ (item.total_lunas ?? 0).toLocaleString() }}
            </td>

            <!-- Aksi -->
            <td class="text-center px-6 py-4 align-top flex justify-center">
              <LightButton @click=""> <NabungIcon class="h-7 w-7 text-gray-600" /></LightButton>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="w-full bg-gray-50">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :pages="pages"
          :totalColumns="totalColumns"
          @prev-page="handlePrev"
          @next-page="handleNext"
          @page-now="handlePageNow"
        />
      </table>
    </div>
  </div>
</template>
