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
  daftar_hotel,
  daftar_kota,
  daftar_transaksi,
  add_transaksi,
  hapus_transaksi,
} from '@/service/transaksi_hotel'

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
const kotaOptions = ref<{ id: number | string; name: string; kota: string }[]>([])
const hotelOptions = ref<{ id: number | string; name: string }[]>([])
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

const rows = ref([
  {
    name: '',
    identity_number: '',
    kota_id: '',
    birth_place: '',
    birth_date: '',
    hotel_id: '',
    check_in: '',
    check_out: '',
    price: '',
    payer: false,
  },
])

const addRow = () => {
  rows.value.push({
    name: '',
    identity_number: '',
    kota_id: '',
    birth_place: '',
    birth_date: '',
    hotel_id: '',
    check_in: '',
    check_out: '',
    price: '',
    payer: false,
  })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

onMounted(async () => {
  await fetchKotaOptions()
  await fetchHotelOptions()
  await fetchDataTransaksi()
})

const fetchKotaOptions = async () => {
  try {
    const data = await daftar_kota()
    kotaOptions.value = data.map((item: any) => ({
      id: item.id,
      name: `${item.name} (${item.kode})`,
    }))
    console.log('data kota', data)
  } catch (error) {
    displayNotification('Gagal ambil data kota', 'error')
  }
}

const fetchHotelOptions = async () => {
  try {
    const data = await daftar_hotel()
    hotelOptions.value = data.map((item: any) => ({
      id: item.id,
      name: `${item.name} - ${item.kota}`, // biar jelas dari kota mana
    }))
    console.log('data hotel', data)
  } catch (error) {
    displayNotification('Gagal ambil data hotel', 'error')
  }
}

const data = ref<any[]>([])

const fetchDataTransaksi = async () => {
  try {
    const result = await daftar_transaksi()
    data.value = result
    console.log('data transaksi', data)
    console.log('data value', data.value)
  } catch (error) {
    displayNotification('Gagal ambil data transaksi', 'error')
  }
}

const formatHarga = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

const deleteData = async (id: number) => {
  showConfirmation('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus data ini?', async () => {
    try {
      await hapus_transaksi({ id: id })
      showConfirmDialog.value = false
      displayNotification('Operasi berhasil!', 'success')
      fetchDataTransaksi()
    } catch (error) {
      console.error('Error deleting data:', error)
      displayNotification(error?.response?.data?.error_msg, 'error')
    }
  })
}

const formatHargaInput = (value: number | string) => {
  const angka =
    typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, '')) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

const parseHarga = (val: unknown): number => {
  return parseInt(String(val).replace(/\D/g, '')) || 0
}

const submitTransaksi = async () => {
  try {
    const payload = {
      details: rows.value.map((row) => ({
        name: row.name,
        identity_number: row.identity_number,
        birth_place: row.birth_place,
        birth_date: row.birth_date,
        check_in: row.check_in,
        check_out: row.check_out,
        price: parseHarga(row.price),
        mst_kota_id: row.kota_id,
        mst_hotel_id: row.hotel_id,
        payer: row.payer,
      })),
    }

    console.log('payload', payload)

    // ⬇️ ambil response dari add_transaksi
    const response = await add_transaksi(payload)
    const invoice = response?.invoice

    if (!invoice) throw new Error('Invoice tidak ditemukan di response')

    showModal.value = false
    resetForm()

    displayNotification(`Transaksi berhasil! Invoice: ${invoice}`, 'success')

    // 🧾 Open tab baru buat print kwitansi
    const printUrl = `/kwitansi-trans-hotel/${invoice}`
    window.open(printUrl, '_blank')

    await fetchDataTransaksi()
  } catch (error: any) {
    console.error(error)
    displayNotification(
      error?.response?.data?.error_msg || error.message || 'Gagal simpan transaksi',
      'error',
    )
  }
}

const resetForm = () => {
  rows.value = [
    {
      name: '',
      identity_number: '',
      kota_id: '',
      birth_place: '',
      birth_date: '',
      hotel_id: '',
      check_in: '',
      check_out: '',
      price: '',
      payer: false,
    },
  ]
}

const cetak_invoice = (invoice: string) => {
  const printUrl = `/kwitansi-trans-hotel/${invoice}`
  window.open(printUrl, '_blank')
}
</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-between items-center mb-6">
      <!-- Tombol Tambah di kiri -->
      <PrimaryButton @click="showModal = true" class="flex items-center gap-2">
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
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[10%]">Invoice</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Nama/Nomor Identitas Pembayar</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[40%]">Info Transaksi Hotel</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Total</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Tanggal Transaksi</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[5%]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="data.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">Data tidak ada</td>
          </tr>
          <tr
            v-for="transaksi in data"
            :key="transaksi.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-center align-top">{{ transaksi.invoice }}</td>
            <td class="px-6 py-4 text-center align-top">
              {{ transaksi.payer }} / {{ transaksi.payer_identity }}
            </td>
            <td class="px-6 py-4 text-left space-y-3">
              <div v-for="(detail, idx) in transaksi.details" :key="idx" class="border-b pb-2">
                <p class="font-semibold text-gray-800 mb-2">{{ detail.hotel_name }}</p>
                <div class="grid grid-cols-[100px_1fr] text-sm text-gray-700 gap-y-1">
                  <span>Nama</span><span>: {{ detail.name }}</span> <span>Identitas</span
                  ><span>: {{ detail.identity_number }}</span> <span>TTL</span
                  ><span>: {{ detail.birth_place }}, {{ detail.birth_date }}</span>
                  <span>Check-in</span><span>: {{ detail.check_in }}</span> <span>Check-out</span
                  ><span>: {{ detail.check_out }}</span> <span>Harga</span
                  ><span>: {{ formatHarga(detail.price) }}</span>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 text-center align-top">
              {{ formatHarga(transaksi.total_harga) }}
            </td>
            <td class="px-6 py-4 text-center align-top">{{ transaksi.tanggal_transaksi }}</td>
            <td class="px-6 py-4 text-center align-top">
              <div class="flex flex-col items-center gap-2">
                <LightButton @click="cetak_invoice(transaksi.invoice)">
                  <CetakIcon />
                </LightButton>
                <DangerButton @click="deleteData(transaksi.id)">
                  <DeleteIcon />
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
      <!-- <table class="w-full">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :pages="pages"
          :totalColumns="totalColumns"
          @prev-page="handlePrev"
          @next-page="handleNext"
          @page-now="handlePageNow"
        />
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
    @submit="submitTransaksi"
    :submitLabel="'Simpan'"
    :width="'w-2/3'"
    :label="'Tambah Transaksi Hotel'"
  >
    <table class="table-auto w-full">
      <thead class="bg-gray-100 text-sm text-gray-700">
        <tr class="text-center">
          <th class="w-[30%] px-4 py-2">Info Pelanggan</th>
          <th class="w-[30%] px-4 py-2">Info Hotel</th>
          <th class="w-[20%] px-4 py-2">Biaya</th>
          <th class="w-[20%] px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="align-top border-t border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <td class="text-left px-4 pt-6 pb-2 space-y-2">
            <InputText
              v-model="row.name"
              placeholder="Masukkan nama pelanggan"
              :note="'Nama Pelanggan'"
            />
            <InputText
              v-model="row.identity_number"
              placeholder="Masukkan identitas"
              :note="'Identitas Pelanggan'"
            />
            <SelectField
              v-model="row.kota_id"
              placeholder="Pilih Kota"
              :note="'Kota Pelanggan'"
              :options="kotaOptions"
            />
            <InputText
              v-model="row.birth_place"
              placeholder="Masukkan tempat lahir"
              :note="'Tempat Lahir'"
            />
            <InputDate
              v-model="row.birth_date"
              placeholder="Masukkan tanggal lahir"
              :note="'Tanggal Lahir'"
            />
          </td>

          <td class="text-left px-4 pt-6 pb-2 space-y-2">
            <SelectField
              v-model="row.hotel_id"
              placeholder="Pilih hotel"
              :note="'Pilih Hotel'"
              :options="hotelOptions"
            />
            <InputDate v-model="row.check_in" :note="'Tanggal check in'" />
            <InputDate v-model="row.check_out" :note="'Tanggal check out'" />
          </td>

          <td class="text-left px-4 pt-6 pb-2 space-y-2">
            <InputText
              :modelValue="formatHargaInput(row.price)"
              @update:modelValue="(val) => (row.price = parseHarga(val))"
              placeholder="Harga Paket"
              :note="'Harga Per Paket'"
            />
          </td>

          <td class="text-center px-4 pt-6 pb-2 align-top">
            <div class="flex flex-col items-center gap-2">
              <label class="inline-flex items-center">
                <input
                  class="w-5 h-5 border-gray-300 text-gray-600 rounded focus:ring-gray-500"
                  type="checkbox"
                  v-model="row.payer"
                />
                <span class="ml-2 text-sm text-gray-700">Pembayar</span>
              </label>
              <DangerButton @click="removeRow(index)" size="sm">
                <DeleteIcon />
              </DangerButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-end">
      <PrimaryButton @click="addRow">+ Tambah Pelanggan</PrimaryButton>
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
