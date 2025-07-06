<script setup lang="ts">
import Confirmation from '@/components/Modal/Confirmation.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import InputDate from '@/components/Form/InputDate.vue'
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'
import TextArea from '@/components/Form/TextArea.vue'
import Notification from '@/components/Modal/Notification.vue'
import InputReadonly from '@/components/Form/InputReadonly.vue'
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import CetakIcon from '@/components/Icons/CetakIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { ref, watch, computed, onMounted } from 'vue'

import {
  daftar_transaksi,
  add_transaksi,
  delete_transaksi,
  daftar_mobil,
} from '@/service/trans_transport'

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
const MobilOptions = ref<{ id: number | string; name: string; kota: string }[]>([])

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
const totalColumns = 6 // karena table punya 5 kolom

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
  if (!searchQuery.value) return data.value

  const keyword = searchQuery.value.toLowerCase()

  return data.value.filter(
    (item) =>
      item.payer?.toLowerCase().includes(keyword) ||
      item.payer_identity?.toLowerCase().includes(keyword) ||
      item.invoice?.toLowerCase().includes(keyword) ||
      item.nama_mobil?.toLowerCase().includes(keyword) ||
      item.car_number?.toLowerCase().includes(keyword),
  )
})

const data = ref<any[]>([]) // array kosong

const fetchData = async () => {
  try {
    // const response = await get_paket_agen({ paket_id: props.paketId })
    const response = await daftar_transaksi()
    data.value = response
    console.log(data.value)
  } catch (error) {
    console.error(error)
  }
}

const deleteData = async (id: number) => {
  showConfirmation('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus data ini?', async () => {
    try {
      await delete_transaksi({ id: id })
      showConfirmDialog.value = false
      displayNotification('Operasi berhasil!', 'success')
      fetchData()
    } catch (error) {
      console.error('Error deleting data:', error)
      displayNotification(error?.response?.data?.error_msg, 'error')
    }
  })
}

const fetchMobil = async () => {
  try {
    const data = await daftar_mobil()
    MobilOptions.value = data.map((item: any) => ({
      id: item.id,
      name: `${item.name}`,
    }))
    console.log('data kota', data)
  } catch (error) {
    displayNotification('Gagal ambil data kota', 'error')
  }
}

onMounted(() => {
  fetchData()
  fetchMobil()
  searchQuery.value = ''
})

const formData = ref({
  payer: '',
  payer_identity: '',
  address: '',
})

const formMobilList = ref([
  {
    mst_mobil_id: '',
    car_number: '',
    price: null,
  },
])

const addMobil = () => {
  formMobilList.value.push({
    mst_mobil_id: '',
    car_number: '',
    price: null,
  })
}

const removeMobil = (index: number) => {
  if (formMobilList.value.length > 1) {
    formMobilList.value.splice(index, 1)
  }
}

const cetak_invoice = (invoice: string) => {
  const printUrl = `/kwitansi-trans-transport/${invoice}`
  window.open(printUrl, '_blank')
}

const submitForm = async () => {
  try {
    const payload = {
      name: formData.value.payer,
      identity_number: formData.value.payer_identity,
      address: formData.value.address,
      details: formMobilList.value.map((mobil) => ({
        mst_mobil_id: Number(mobil.mst_mobil_id),
        car_number: mobil.car_number,
        price: Number(mobil.price),
      })),
    }

    const response = await add_transaksi(payload)

    const invoice = response?.invoice

    if (!invoice) throw new Error('Invoice tidak ditemukan di response')

    showModal.value = false
    resetForm()

    displayNotification(`Transaksi berhasil! Invoice: ${invoice}`, 'success')

    // 🧾 Open tab baru buat print kwitansi
    const printUrl = `/kwitansi-trans-transport/${invoice}`
    window.open(printUrl, '_blank')

    // refresh data
    fetchData()
  } catch (error: any) {
    console.error('❌ Gagal submit:', error)
    displayNotification(error?.response?.data?.error_msg || 'Gagal menambahkan transaksi', 'error')
  }
}

const resetForm = () => {
  formData.value = {
    payer: '',
    payer_identity: '',
    address: '',
  }

  formMobilList.value = [
    {
      mst_mobil_id: '',
      car_number: '',
      price: null,
    },
  ]
}

// Format ke IDR
const formatToIDR = (value: number | string): string => {
  const num = typeof value === 'string' ? Number(value.replace(/[^\d]/g, '')) : value
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num || 0)
}

// Ambil angka asli dari string IDR
const parseIDR = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ''))
}
</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-between items-center mb-6">
      <!-- Tombol Tambah di kiri -->
      <PrimaryButton @click="showModal = true" >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M2 4a2 2 0 012-2h16a2 2 0 012 2v4H2V4zm0 6h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10zm4 4a1 1 0 000 2h4a1 1 0 000-2H6z"
          />
        </svg>

        Tambah Transaksi
      </PrimaryButton>

      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
          placeholder="Cari Transaksi..."
        />
      </div>
    </div>
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[10%]">Invoice</th>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[30%]">Nama / Nomor Identitas Pembayar</th>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[30%]">Info Transport</th>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[15%]">Total</th>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[15%]">Tanggal Transaksi</th>
            <th class="text-center font-medium text-gray-900 px-6 py-3 w-[10%]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="filteredData.length === 0"><td colspan="6" class="text-center py-4 text-gray-500">Daftar Transaksi Transport Tidak Ditemukan</td></tr>
          <tr v-for="item in filteredData" :key="item.invoice" class="hover:bg-gray-50">
            <td class="text-center px-6 py-4 align-top">{{ item.invoice }}</td>
            <td class="text-center px-6 py-4 align-top"><div>{{ item.payer }} / {{ item.payer_identity }}</div></td>
            <td class="px-6 py-4 align-top">
              <div v-for="(mobil, idx) in item.detail_mobil" :key="idx" class="mb-2">
                <div class="grid grid-cols-[120px_1fr] gap-y-1 items-start">
                  <div>Nama Mobil</div>
                  <div>: <strong>{{ mobil.nama_mobil }}</strong></div>
                  <div>Plat Mobil</div>
                  <div>: {{ mobil.car_number }}</div>
                  <div>Harga Per Paket</div>
                  <div>: Rp {{ mobil.price?.toLocaleString() }}</div>
                </div>
                <hr class="my-2 border-dashed" />
              </div>
            </td>
            <td class="text-center px-6 py-4 align-top">Rp {{ item.total_price?.toLocaleString() }}</td>
            <td class="text-center px-6 py-4 align-top">{{ item.tanggal_transaksi }}</td>
            <td class="px-6 py-4 text-center align-top">
              <div class="flex flex-col items-center gap-2">
                <LightButton @click="cetak_invoice(item.invoice)">
                  <CetakIcon class="h-4 w-4 text-gray-600" />
                </LightButton>
                <DangerButton @click="deleteData(item.id)">
                  <DeleteIcon class="w-5 h-5" />
                </DangerButton>
              </div>
            </td>
          </tr>
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
        />
        </tfoot>
      </table>

      <!-- <table class="w-full bg-gray-50">

      </table> -->
    </div>
  </div>

  <Form
    :formStatus="showModal"
    @cancel="
      () => {
        showModal = false
        resetForm()
      }
    "
    @submit="submitForm"
    :submitLabel="'Simpan'"
    :width="'w-1/3'"
    :label="'Tambah Transaksi Transport'"
  >
    <div class="flex gap-4">
      <div class="w-1/2">
        <InputText v-model="formData.payer" placeholder="Masukkan Nama" :note="'Nama Pelanggan'" />
      </div>

      <div class="w-1/2">
        <InputText
          v-model="formData.payer_identity"
          placeholder="Masukkan Identitas"
          :note="'Identitas Pelanggan'"
        />
      </div>
    </div>

    <TextArea
      v-model="formData.address"
      id="address"
      placeholder="Tuliskan Alamat Anda..."
      :note="'Contoh: Jl. Raya Jakarta No. 123, Jakarta Selatan, DKI Jakarta'"
    />

    <table class="table-auto w-full">
      <thead class="bg-gray-100 text-sm text-gray-700">
        <tr class="text-center">
          <th class="w-[90%] px-4 py-2">Info Mobil</th>
          <th class="w-[10%] px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody class="align-top border-t border-gray-200">
        <tr
          v-for="(mobil, index) in formMobilList"
          :key="index"
          class="hover:bg-gray-100 border-b border-dashed border-gray-700 pt-4"
        >
          <td class="px-4 py-2">
            <SelectField
              note="Mobil"
              v-model="mobil.mst_mobil_id"
              placeholder="Pilih Mobil"
              :options="MobilOptions"
            />

            <div class="flex gap-4 mt-2">
              <div class="w-1/2">
                <InputText
                  v-model="mobil.car_number"
                  note="Plat Mobil"
                  placeholder="Masukkan Plat Mobil"
                />
              </div>
              <div class="w-1/2">
                <InputText
                  :modelValue="formatToIDR(mobil.price)"
                  @update:modelValue="mobil.price = parseIDR($event)"
                  note="Harga Per Paket"
                  placeholder="Masukkan harga per paket"
                />
              </div>
            </div>
          </td>

          <td class="px-4 py-2 text-center">
            <DangerButton class="mt-2.5" @click="removeMobil(index)">
              <DeleteIcon class="w-5 h-5" />
            </DangerButton>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-end">
      <PrimaryButton @click="addMobil">+ Tambah Mobil</PrimaryButton>
    </div>
  </Form>

  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <button
      @click="confirmAction && confirmAction()"
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

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
