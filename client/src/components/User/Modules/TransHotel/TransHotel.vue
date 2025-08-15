<script setup lang="ts">
import Confirmation from '@/components/Modal/Confirmation.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import InputDate from '@/components/Form/InputDate.vue'
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'
import TextArea from '@/components/Form/TextArea.vue'
import Notification from '@/components/Modal/Notification.vue'
import InputReadonly from '@/components/Form/InputReadonly.vue'
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import IconMoney from '@/components/Icons/IconMoney.vue'
import CetakIcon from '@/components/Icons/CetakIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import { ref, watch, computed, onMounted } from 'vue'

import { paramCabang } from '@/service/param_cabang'

import {
  daftar_hotel,
  daftar_kota,
  daftar_transaksi,
  add_transaksi,
  hapus_transaksi,
  daftar_customer,
  daftar_paket,
} from '@/service/transaksi_hotel'
import { name } from '@vue/eslint-config-prettier/skip-formatting'
import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P'

const showModal = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 100
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

const totalColumns = 7
const totalRow = ref(0)

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
    id: '',
    name: '',
    identity_number: '',
    // kostumer_id: '0',
    // paket_id: '0',
    kota_id: '0',
    birth_place: '',
    birth_date: '',
    hotel_id: '0',
    check_in: '',
    check_out: '',
    price: '',
    payer: false,
  },
])

const addRow = () => {
  rows.value.push({
    id: '',
    // kostumer_id: '0',
    // paket_id: '0',
    name: '',
    identity_number: '',
    kota_id: '0',
    birth_place: '',
    birth_date: '',
    hotel_id: '0',
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
  await fetchCustomer()
  await fetchCabang()
})

const fetchKotaOptions = async () => {
  try {
    const data = await daftar_kota()
    kotaOptions.value = [
      { id: 0, name: 'Pilih Kota' },
      ...data.map((item: any) => ({
        id: item.id,
        name: `${item.name} - ${item.kode}`,
      })),
    ]
    console.log('data kota', data)
  } catch (error) {
    displayNotification('Gagal ambil data kota', 'error')
  }
}

const fetchHotelOptions = async () => {
  try {
    const data = await daftar_hotel()
    hotelOptions.value = [
      { id: 0, name: 'Pilih Hotel' },
      ...data.map((item: any) => ({
        id: item.id,
        name: `${item.name} - ${item.kota}`,
      })),
    ]
  } catch (error) {
    displayNotification('Gagal ambil data hotel', 'error')
  }
}

const data = ref<any[]>([])

const fetchDataTransaksi = async () => {
  try {
    const result = await daftar_transaksi({
      search: searchQuery.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    })
    data.value = result.data
    totalRow.value = result.total
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

const errors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  let isValid = true

  errors.value = {}

  rows.value.forEach((row, index) => {
    if (SelectedCustomer.value === 0) {
      displayNotification('Anda harus memilih kostumer', 'error')
      isValid = false
    }

    if (!row.name) {
      errors.value[`name_${index}`] = 'Nama tidak boleh kosong'
      isValid = false
    }
    if (!row.identity_number) {
      errors.value[`identity_number_${index}`] = 'Nomor identitas tidak boleh kosong'
      isValid = false
    }
    if (row.birth_date === '') {
      errors.value[`birth_date_${index}`] = 'Tanggal Lahir Tidak Boleh Kosong'
      isValid = false
    }
    if (row.birth_place === '') {
      errors.value[`birth_place_${index}`] = 'Tempat Lahir Tidak Boleh Kosong'
      isValid = false
    }
    if (row.check_in === '') {
      errors.value[`check_in_${index}`] = 'Tanggal Checkin Tidak Boleh Kosong'
      isValid = false
    }
    if (row.check_out === '') {
      errors.value[`check_out_${index}`] = 'Tanggal Checkout Tidak Boleh Kosong'
      isValid = false
    }
    if (row.hotel_id === '0' || row.hotel_id == '') {
      errors.value[`hotel_id_${index}`] = 'Anda Wajib Memilih Salah Satu Hotel'
      isValid = false
    }

    if (row.kota_id === '0' || row.kota_id == '') {
      errors.value[`kota_id_${index}`] = 'Anda Wajib Memilih Salah Satu Kota'
      isValid = false
    }

    if (row.price === '') {
      errors.value[`price_${index}`] = 'Harga Paket Wajib Diisi'
      isValid = false
    }
  })

  return isValid
}

const submitTransaksi = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const payload = {
      kostumer_id: SelectedCustomer.value,
      paket_id: SelectedPaket.value,
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
      id: '',
      name: '',
      identity_number: '',
      // kostumer_id: '0',
      // paket_id: '0',
      kota_id: '0',
      birth_place: '',
      birth_date: '',
      hotel_id: '0',
      check_in: '',
      check_out: '',
      price: '',
      payer: false,
    },
  ]
  errors.value = {}
}

const cetak_invoice = (invoice: string) => {
  const printUrl = `/kwitansi-trans-hotel/${invoice}`
  window.open(printUrl, '_blank')
}

interface costumer {
  id: number
  name: string
}

const customerOption = ref<costumer[]>([])
const SelectedCustomer = ref(0)
const fetchCustomer = async () => {
  try {
    const response = await daftar_customer()
    customerOption.value = [{ id: 0, name: 'Pilih Kostumer' }, ...response]
  } catch (error) {
    console.error(error)
  }
}

interface cabang {
  id: number
  name: string
}
const cabangOption = ref<cabang[]>([])
const SelectedCabang = ref(0)
const fetchCabang = async () => {
  try {
    const response = await paramCabang()
    cabangOption.value = [{ id: 0, name: 'Pilih Cabang' }, ...response.data]
  } catch (error) {
    console.error(error)
  }
}

interface paket {
  id: number
  name: string
}
const paketOption = ref<paket[]>([{ id: 0, name: 'Pilih Paket' }]) // Tambahkan opsi default
const SelectedPaket = ref(0)
const fetchPaket = async () => {
  try {
    const response = await daftar_paket({
      division_id: SelectedCabang.value,
    })
    paketOption.value = [{ id: 0, name: 'Pilih Paket' }, ...response]
  } catch (error) {
    console.error(error)
  }
}

watch(SelectedCabang, async (newCabang) => {
  if (newCabang) {
    await fetchPaket()
  }
})
</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-between items-center mb-6">
      <PrimaryButton @click="showModal = true" class="flex items-center gap-2">
        <IconMoney />
        Tambah Transaksi Hotel
      </PrimaryButton>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          @keyup="fetchDataTransaksi()"
          class="w-full sm:w-72 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cari Invoice..."
        />
      </div>
    </div>
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[10%]">Invoice</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[20%]">Nama Costumer</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Paket</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[35%]">Info Transaksi Hotel</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Total</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[15%]">Tanggal</th>
            <th class="px-6 py-3 font-medium text-gray-900 text-center w-[5%]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="data.length === 0">
            <td colspan="6" class="px-6 py-3 text-center text-gray-500">
              Daftar Transaksi Hotel Tidak Ditemukan
            </td>
          </tr>
          <tr v-else v-for="transaksi in data" :key="transaksi.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-center align-top">{{ transaksi.invoice }}</td>
            <td class="px-6 py-4 text-center align-top">{{ transaksi.kostumer_name }} <br /></td>
            <td class="px-6 py-4 text-center align-top">{{ transaksi.paket_name }} <br /></td>
            <td class="px-6 py-4 text-left space-y-3">
              <div v-for="(detail, idx) in transaksi.details" :key="idx" class="pb-2" :class="transaksi.details.length - 1 == idx ? '' : 'border-b'" >
                <p class="font-semibold text-gray-800 mb-2">{{ detail.hotel_name }}</p>
                <div class="grid grid-cols-[100px_1fr] text-sm text-gray-700 gap-y-1">
                  <span>Nama</span><span>: {{ detail.name }}</span> <span>Identitas</span><span>: {{ detail.identity_number }}</span> <span>TTL</span
                  ><span>: {{ detail.birth_place }}, {{ detail.birth_date }}</span>
                  <span>Check-in</span><span>: {{ detail.check_in }}</span> <span>Check-out</span
                  ><span>: {{ detail.check_out }}</span> <span>Harga</span
                  ><span>: {{ formatHarga(detail.price) }}</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-center align-top">{{ formatHarga(transaksi.total_harga) }}</td>
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
          <Pagination :currentPage="currentPage" :totalPages="totalPages" :pages="pages" :totalColumns="totalColumns" @prev-page="handlePrev" @next-page="handleNext" @page-now="handlePageNow" :totalRow="totalRow"/>
        </tfoot>
      </table>
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
    :submitLabel="'TAMBAH TRANSAKSI HOTEL'"
    :width="'w-2/3'"
    :label="'Tambah Transaksi Hotel'"
  >
    <div class="flex flex-wrap gap-4 pb-3 mb-5">
      <SelectField
        label="Kostumer"
        v-model="SelectedCustomer"
        :options="customerOption"
        class="flex-1 min-w-[200px]"
      />
      <SelectField
        label="Cabang"
        v-model="SelectedCabang"
        :options="cabangOption"
        class="flex-1 min-w-[200px]"
      />
      <SelectField
        label="Paket"
        v-model="SelectedPaket"
        :options="paketOption"
        class="flex-1 min-w-[200px]"
      />
    </div>

    <table class="table-auto w-full">
      <thead class="bg-gray-100 text-sm text-gray-700">
        <tr class="text-center">
          <th class="w-[25%] px-4 font-medium py-3">Info Pelanggan</th>
          <th class="w-[40%] px-4 font-medium py-3">Info Hotel</th>
          <th class="w-[20%] px-4 font-medium py-3">Biaya</th>
          <th class="w-[5%] px-4 font-medium py-3">Aksi</th>
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
              placeholder="Masukkan nama"
              class="pb-3"
              label="Nama"
              :error="errors['name_' + index]"
            />
            <InputText
              v-model="row.identity_number"
              placeholder="Masukkan nomor identitas"
              class="pb-3"
              label="Nomor Identitas"
              :error="errors['identity_number_' + index]"
            />
            <SelectField
              v-model="row.kota_id"
              placeholder="Pilih Kota"
              label="Kota"
              :options="kotaOptions"
              class="pb-3"
              :error="errors['kota_id_' + index]"
            />
            <InputText
              v-model="row.birth_place"
              placeholder="Masukkan tempat lahir"
              class="pb-3"
              label="Tempat Lahir"
              :error="errors['birth_place_' + index]"
            />
            <InputDate
              v-model="row.birth_date"
              placeholder="Masukkan tanggal lahir"
              class="pb-3"
              label="Tanggal Lahir"
              :error="errors['birth_date_' + index]"
            />
          </td>
          <td class="text-left px-4 pt-6 pb-2 space-y-2">
            <SelectField
              v-model="row.hotel_id"
              placeholder="Pilih hotel"
              label="Nama Hotel"
              :options="hotelOptions"
              class="pb-3"
              :error="errors['hotel_id_' + index]"
            />
            <InputDate
              v-model="row.check_in"
              class="pb-3"
              label="Tanggal Checkin"
              :error="errors['check_in_' + index]"
            />
            <InputDate
              v-model="row.check_out"
              class="pb-3"
              label="Tanggal Checkout"
              :error="errors['check_out_' + index]"
            />
          </td>
          <td class="text-left px-4 pt-6 pb-2 space-y-2">
            <InputText
              :modelValue="formatHargaInput(row.price)"
              @update:modelValue="(val) => (row.price = parseHarga(val))"
              placeholder="Harga Paket"
              label="Harga Paket"
              :error="errors['price_' + index]"
            />
          </td>

          <td class="text-center px-4 pt-6 pb-2 align-top">
            <div class="flex flex-col items-center gap-2 pt-7">
              <DangerButton @click="removeRow(index)" size="sm">
                <DeleteIcon />
              </DangerButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-end bg-gray-100 p-3">
      <PrimaryButton @click="addRow"><IconPlus></IconPlus> Tambah Pelanggan</PrimaryButton>
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
    :notificationMessageHtml="notificationMessage"
    @close="showNotification = false"
  />
</template>
