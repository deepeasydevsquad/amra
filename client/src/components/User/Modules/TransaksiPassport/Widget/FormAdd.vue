<script setup lang="ts">
import { reactive, ref, onMounted, defineProps, defineEmits } from 'vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import { addTransaksiPassport, getCityList } from '@/service/transaksi_passport'
import InputText from '@/components/User/Modules/TransaksiPassport/Particle/InputText.vue'
import SelectField from '@/components/User/Modules/TransaksiPassport/Particle/SelectField.vue'
import InputDate from '@/components/User/Modules/TransaksiPassport/Particle/InputDate.vue'
import TextArea from '@/components/User/Modules/TransaksiPassport/Particle/TextArea.vue'
import Notification from '@/components/User/Modules/TransaksiVisa/Particle/Notification.vue'

// Props & Emits
const props = defineProps<{ isFormOpen: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save-success', message: string): void
}>()

// === STATE & INTERFACE ===
const showNotification = ref<boolean>(false)
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'warning' | 'error'>('success')
const isLoading = ref<boolean>(false)
const cityOptions = ref<DropdownOption[]>([])
const cityList = ref<CityOption[]>([])

interface DropdownOption {
  value: number | string
  label: string
}

interface FormState {
  invoice: string
  payer: string
  payer_identity: string
  status?: 'pending' | 'success' | 'duplicate' | 'error'
}

interface CityOption {
  id: number
  name: string
  kode: string
}

interface PassportRow {
  name: string
  identity_number: string
  kk_number: string
  birth_place: string
  birth_date: string
  address: string
  city: number | string
  price: number
  is_payer: boolean
}

const generateInvoiceCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomCode = ''
  for (let i = 0; i < 6; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${randomCode}`
}

const getDefaultFormState = (): FormState => ({
  invoice: generateInvoiceCode(),
  payer: '',
  payer_identity: '',
  status: 'pending',
})

const form = reactive<FormState>(getDefaultFormState())
const passportRows = ref<PassportRow[]>([
  {
    name: '',
    identity_number: '',
    kk_number: '',
    birth_place: '',
    birth_date: '',
    address: '',
    city: '',
    price: 0,
    is_payer: false,
  },
])

const errors = ref<Record<string, string>>({})

// === METHODS ===
const fetchCityList = async () => {
  try {
    const response: any = await getCityList()

    if (response && response.success && response.data) {
      cityList.value = response.data
      // Update cityOptions untuk dropdown
      cityOptions.value = response.data.map((city: CityOption) => ({
        value: city.id,
        label: `${city.name} (${city.kode})`,
      }))
    } else if (response && Array.isArray(response)) {
      // Jika response langsung berupa array
      cityList.value = response
      cityOptions.value = response.map((city: CityOption) => ({
        value: city.id,
        label: `${city.name} (${city.kode})`,
      }))
    } else {
      console.error('Format response tidak sesuai:', response)
      displayNotification('Gagal mengambil daftar kota', 'error')
    }
  } catch (error) {
    console.error('Error fetching city list:', error)
    displayNotification('Terjadi kesalahan saat mengambil daftar kota', 'error')
  }
}

const formatErrorMessage = (message: string): string => {
  if (!message) return ''

  // Replace <br> tags dengan line breaks
  let formattedMessage = message.replace(/<br\s*\/?>/gi, '\n')

  // Split berdasarkan line breaks dan format sebagai bullet points
  const lines = formattedMessage.split('\n').filter((line) => line.trim() !== '')

  if (lines.length > 1) {
    return lines.map((line) => `• ${line.trim()}`).join('\n')
  }

  return formattedMessage
}

const displayNotification = (
  message: string,
  type: 'success' | 'warning' | 'error' = 'success',
) => {
  notificationMessage.value = formatErrorMessage(message)
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 8000)
}

const validateForm = (): boolean => {
  errors.value = {}

  // Validate payer info - pastikan ada pembayar yang dipilih
  const hasPayer = passportRows.value.some((row) => row.is_payer)
  if (!hasPayer) {
    errors.value.payer = 'Pilih salah satu pelanggan sebagai pembayar'
  } else {
    const payerRow = passportRows.value.find((row) => row.is_payer)!
    form.payer = payerRow.name
    form.payer_identity = payerRow.identity_number
  }

  // Validate passport rows
  passportRows.value.forEach((row, index) => {
    if (!row.name.trim()) errors.value[`name_${index}`] = 'Nama pelanggan wajib diisi'
    if (!row.identity_number.trim())
      errors.value[`identity_${index}`] = 'Nomor identitas wajib diisi'
    if (!row.kk_number.trim()) errors.value[`kk_${index}`] = 'Nomor KK wajib diisi'
    if (!row.birth_place.trim()) errors.value[`birth_place_${index}`] = 'Tempat lahir wajib diisi'
    if (!row.birth_date.trim()) errors.value[`birth_date_${index}`] = 'Tanggal lahir wajib diisi'
    if (!row.address.trim()) errors.value[`address_${index}`] = 'Alamat wajib diisi'
    if (!row.city || Number(row.city) <= 0)
      errors.value[`city_${index}`] = 'Kota wajib dipilih dan ID harus lebih dari 0'
    if (row.price <= 0) errors.value[`price_${index}`] = 'Harga harus lebih dari 0'
  })

  return Object.keys(errors.value).length === 0
}

const addPassportRow = () => {
  passportRows.value.push({
    name: '',
    identity_number: '',
    kk_number: '',
    birth_place: '',
    birth_date: '',
    address: '',
    city: '',
    price: 0,
    is_payer: false,
  })
}

const removePassportRow = (index: number) => {
  if (passportRows.value.length > 1) {
    if (passportRows.value[index].is_payer) {
      form.payer = ''
      form.payer_identity = ''

      if (passportRows.value.length - 1 === 1) {
        // Check if only one row will remain
        setAsPayer(0 === index ? 1 : 0)
      }
    }
    passportRows.value.splice(index, 1)
  }
}

const setAsPayer = (index: number) => {
  passportRows.value.forEach((row) => (row.is_payer = false))

  passportRows.value[index].is_payer = true

  const selectedRow = passportRows.value[index]
  form.payer = selectedRow.name
  form.payer_identity = selectedRow.identity_number
}

const handleSubmit = async () => {
  if (!validateForm()) {
    displayNotification('Mohon lengkapi semua field yang wajib diisi', 'error')
    return
  }

  try {
    isLoading.value = true

    const payerRow = passportRows.value.find((row) => row.is_payer)
    if (!payerRow) {
      displayNotification('Pilih salah satu pelanggan sebagai pembayar', 'error')
      return
    }

    const transactionData = {
      invoice: form.invoice,
      payer: payerRow.name,
      payer_identity: payerRow.identity_number,
      passport_details: passportRows.value.map((row) => ({
        name: row.name,
        identity_number: row.identity_number,
        kk_number: row.kk_number,
        birth_place: row.birth_place,
        birth_date: row.birth_date,
        address: row.address,
        city: Number(row.city),
        price: Number(row.price),
      })),
    }

    console.log('Sending data:', transactionData)

    const response: any = await addTransaksiPassport(transactionData)

    if (response && response.error) {
      displayNotification(response.error_msg || 'Gagal menyimpan data', 'error')
      return
    }

    emit('save-success', 'Transaksi passport berhasil ditambahkan')
    closeForm()
  } catch (error: any) {
    console.error('Error saving transaction:', error)

    let errorMessage = 'Terjadi kesalahan saat menyimpan data'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error_msg) {
      errorMessage = error.response.data.error_msg
    } else if (error.message) {
      errorMessage = error.message
    }

    displayNotification(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

const closeForm = () => {
  // Reset form
  Object.assign(form, getDefaultFormState())
  passportRows.value = [
    {
      name: '',
      identity_number: '',
      kk_number: '',
      birth_place: '',
      birth_date: '',
      address: '',
      city: '',
      price: 0,
      is_payer: true,
    },
  ]
  errors.value = {}
  showNotification.value = false
  emit('close')
}

// === LIFECYCLE ===
onMounted(() => {
  fetchCityList()
  setAsPayer(0)
})

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
const unformatPrice = (formatted: string) => parseInt(formatted.replace(/[^\d]/g, ''), 10) || 0
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeForm"
  >
    <!-- Mobile & Desktop Responsive Container -->
    <div
      class="relative h-full lg:ml-[314px] lg:mr-[40px] lg:mt-[100px] lg:mb-[50px] md:m-8 m-4 bg-white shadow-lg rounded-lg"
    >
      <div class="h-full p-4 md:p-6 overflow-y-auto rounded-lg">
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b mb-6 gap-4"
        >
          <h3 class="text-lg md:text-xl font-bold text-gray-900">Tambah Transaksi Passport</h3>
          <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
            <span
              class="text-xs sm:text-sm font-medium text-red-600 px-2 sm:px-3 py-1 rounded-lg bg-red-50"
            >
              INVOICE : {{ form.invoice }}
            </span>
            <button
              @click="closeForm"
              class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Passport Transactions -->
          <div class="bg-gray-50 rounded-lg p-4 md:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div class="flex flex-col gap-2">
                <span class="text-sm text-red-600">(*) Wajib diisi</span>
                <span v-if="errors.payer" class="text-sm text-red-600">{{ errors.payer }}</span>
              </div>
              <button
                type="button"
                @click="addPassportRow"
                class="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span class="hidden sm:inline">Tambah Row Transaksi Passport</span>
                <span class="sm:hidden">Tambah Row</span>
              </button>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto border border-gray-200 rounded-lg bg-white">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-[45%]"
                    >
                      Info Pelanggan
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-[25%]"
                    >
                      Info Alamat Pelanggan
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-[20%]"
                    >
                      Biaya & Status
                    </th>
                    <th
                      class="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-[10%]"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(row, index) in passportRows"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Info Pelanggan Column -->
                    <td class="px-8 py-8 align-top">
                      <div class="grid grid-cols-2 gap-6 text-xs">
                        <InputText
                          v-model="row.name"
                          label="Nama Pelanggan"
                          placeholder="Nama Pelanggan"
                          :required="true"
                          :error="errors[`name_${index}`]"
                          class="text-base"
                        />
                        <InputText
                          v-model="row.identity_number"
                          label="Nomor Identitas"
                          placeholder="Nomor Identitas"
                          :required="true"
                          :error="errors[`identity_${index}`]"
                          class="text-base"
                        />
                        <InputText
                          v-model="row.kk_number"
                          label="Nomor KK"
                          placeholder="Nomor KK"
                          :required="true"
                          :error="errors[`kk_${index}`]"
                          class="text-base"
                        />
                        <InputText
                          v-model="row.birth_place"
                          label="Tempat Lahir"
                          placeholder="Tempat Lahir"
                          :required="true"
                          :error="errors[`birth_place_${index}`]"
                          class="text-base"
                        />
                        <InputDate
                          v-model="row.birth_date"
                          label="Tanggal Lahir"
                          type="date"
                          :required="true"
                          :error="errors[`birth_date_${index}`]"
                          class="text-base col-span-2"
                        />
                      </div>
                    </td>

                    <!-- Info Alamat Column -->
                    <td class="px-6 py-6 align-top">
                      <div class="space-y-4">
                        <SelectField
                          v-model="row.city"
                          label="Kota Pelanggan"
                          :options="cityList"
                          option-value="id"
                          option-label="name"
                          placeholder="Pilih Kota"
                          :required="true"
                          :error="errors[`city_${index}`]"
                          class="text-sm"
                        />
                        <TextArea
                          v-model="row.address"
                          label="Alamat Lengkap"
                          placeholder="Alamat Lengkap Pelanggan"
                          :required="true"
                          :error="errors[`address_${index}`]"
                          class="text-sm"
                          rows="3"
                        />
                      </div>
                    </td>

                    <!-- Biaya & Status Column -->
                    <td class="px-6 py-6 align-top">
                      <div class="space-y-4">
                        <!-- Corrected price input for desktop view -->
                        <input
                          type="text"
                          :value="formatPrice(row.price)"
                          @input="
                            row.price = unformatPrice(($event.target as HTMLInputElement).value)
                          "
                          placeholder="Contoh: 1.500.000"
                          class="w-full mt-1 px-3 py-2 border rounded-md font-semibold text-black text-xs placeholder:text-xs"
                          :class="errors[`price_${index}`] ? 'border-red-500' : 'border-gray-300'"
                        />
                        <p v-if="errors[`price_${index}`]" class="text-xs text-red-600 mt-1">
                          {{ errors[`price_${index}`] }}
                        </p>
                        <div class="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <input
                            type="radio"
                            :id="`payer_${index}`"
                            :checked="row.is_payer"
                            @change="setAsPayer(index)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            :for="`payer_${index}`"
                            class="ml-3 text-sm font-medium text-gray-700"
                          >
                            Pembayar
                          </label>
                        </div>
                      </div>
                    </td>

                    <!-- Aksi Column -->
                    <td class="px-6 py-6 align-top text-center">
                      <button
                        v-if="passportRows.length > 1"
                        type="button"
                        @click="removePassportRow(index)"
                        class="inline-flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                        title="Hapus Row"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="lg:hidden space-y-6">
              <div
                v-for="(row, index) in passportRows"
                :key="index"
                class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Pelanggan {{ index + 1 }}</h4>
                  <div class="flex items-center gap-2">
                    <!-- Payer Radio Button -->
                    <div class="flex items-center p-2 bg-gray-50 rounded-lg">
                      <input
                        type="radio"
                        :id="`mobile_payer_${index}`"
                        :checked="row.is_payer"
                        @change="setAsPayer(index)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        :for="`mobile_payer_${index}`"
                        class="ml-2 text-sm font-medium text-gray-700"
                      >
                        Pembayar
                      </label>
                    </div>
                    <!-- Delete Button -->
                    <button
                      v-if="passportRows.length > 1"
                      type="button"
                      @click="removePassportRow(index)"
                      class="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      title="Hapus Row"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Personal Info Section -->
                <div class="space-y-4 mb-6">
                  <h5
                    class="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2"
                  >
                    Info Pelanggan
                  </h5>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputText
                      v-model="row.name"
                      label="Nama Pelanggan"
                      placeholder="Nama Pelanggan"
                      :required="true"
                      :error="errors[`name_${index}`]"
                      class="text-"
                    />
                    <InputText
                      v-model="row.identity_number"
                      label="Nomor Identitas"
                      placeholder="Nomor Identitas"
                      :required="true"
                      :error="errors[`identity_${index}`]"
                      class="text-sm"
                    />
                    <InputText
                      v-model="row.kk_number"
                      label="Nomor KK"
                      placeholder="Nomor KK"
                      :required="true"
                      :error="errors[`kk_${index}`]"
                      class="text-sm"
                    />
                    <InputText
                      v-model="row.birth_place"
                      label="Tempat Lahir"
                      placeholder="Tempat Lahir"
                      :required="true"
                      :error="errors[`birth_place_${index}`]"
                      class="text-sm"
                    />
                    <div class="sm:col-span-2">
                      <InputDate
                        v-model="row.birth_date"
                        label="Tanggal Lahir"
                        type="date"
                        :required="true"
                        :error="errors[`birth_date_${index}`]"
                        class="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <!-- Address Info Section -->
                <div class="space-y-4 mb-6">
                  <h5
                    class="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2"
                  >
                    Info Alamat
                  </h5>
                  <SelectField
                    v-model="row.city"
                    label="Kota Pelanggan"
                    :options="cityList"
                    option-value="id"
                    option-label="name"
                    placeholder="Pilih Kota"
                    :required="true"
                    :error="errors[`city_${index}`]"
                    class="text-sm"
                  />
                  <TextArea
                    v-model="row.address"
                    label="Alamat Lengkap"
                    placeholder="Alamat Lengkap Pelanggan"
                    :required="true"
                    :error="errors[`address_${index}`]"
                    class="text-sm"
                    rows="3"
                  />
                </div>

                <!-- Price Section -->
                <div class="space-y-4">
                  <h5
                    class="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2"
                  >
                    Biaya
                  </h5>
                  <input
                    type="text"
                    :value="formatPrice(row.price)"
                    @input="row.price = unformatPrice(($event.target as HTMLInputElement).value)"
                    placeholder="Contoh: 1.500.000"
                    class="w-full mt-1 px-3 py-2 border rounded-md font-semibold text-black text-sm placeholder:text-xs"
                    :class="errors[`price_${index}`] ? 'border-red-500' : 'border-gray-300'"
                  />
                  <p v-if="errors[`price_${index}`]" class="text-xs text-red-600 mt-1">
                    {{ errors[`price_${index}`] }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-6 border-t bg-white sticky bottom-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 pb-4 md:pb-6 rounded-b-lg"
          >
            <button
              type="button"
              @click="closeForm"
              class="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              :disabled="isLoading"
            >
              CANCEL
            </button>
            <PrimaryButton
              type="submit"
              :disabled="isLoading"
              class="w-full sm:w-auto order-1 sm:order-2 px-8 py-3 text-sm font-medium shadow-sm"
            >
              <div v-if="isLoading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </div>
              <span v-else>SIMPAN</span>
            </PrimaryButton>
          </div>
        </form>

        <!-- Notification Component -->
        <Notification
          v-if="showNotification"
          :show-notification="showNotification"
          :notification-message="notificationMessage"
          :notification-type="notificationType"
          @close="showNotification = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better form appearance */
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm;
}

.form-label {
  @apply block text-xs font-medium text-gray-700 mb-1;
}

.form-error {
  @apply text-red-500 text-xs mt-1;
}

/* Custom scrollbar for better appearance */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  /* Ensure form inputs are properly sized on mobile */
  .form-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
