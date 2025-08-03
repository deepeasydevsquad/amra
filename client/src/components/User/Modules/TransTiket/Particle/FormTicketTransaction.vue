<template>
  <Form
    :form-status="showForm"
    :label="'Form Transaksi Tiket'"
    width="w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    @close="handleCancel"
    @cancel="handleCancel"
    @submit="handleSubmit"
    :submitLabel="'BAYAR'"
  >
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-0 px-1">
      <div class="space-y-4">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-[5%] px-6 py-1 font-medium text-gray-900 text-center border">Aksi</th>
              <th class="w-[8%] px-6 py-1 font-medium text-gray-900 text-center border">Pax</th>
              <th class="w-[20%] px-6 py-1 font-medium text-gray-900 text-center border">
                Maskapai
              </th>
              <th class="w-[18%] px-6 py-1 font-medium text-gray-900 text-center border">
                Kode Booking
              </th>
              <th class="w-[13%] px-6 py-1 font-medium text-gray-900 text-center border">
                Tanggal Berangkat
              </th>
              <th class="w-[13%] px-6 py-1 font-medium text-gray-900 text-center border">
                Harga Travel
              </th>
              <th class="w-[13%] px-6 py-1 font-medium text-gray-900 text-center border">
                Harga Kostumer
              </th>
              <th class="w-[10%] px-6 py-1 font-medium text-gray-900 text-center border">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ticket, index) in form.tickets" :key="index">
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <DangerButton @click="removeTicket(index)" class="p-2"><DeleteIcon /></DangerButton>
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <InputText
                  label_status="false"
                  type="number"
                  v-model.number="ticket.pax"
                  label="Pax"
                  id="pax"
                  placeholder="Pax"
                  :error="errors.tickets?.[index]?.pax"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <SelectField
                  label_status="false"
                  v-model="ticket.airlines_id"
                  id="maskapai"
                  label="Maskapai"
                  placeholder="Pilih Maskapai"
                  :options="maskapaiList"
                  :error="errors.tickets?.[index]?.maskapai"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <InputText
                  label_status="false"
                  v-model="ticket.code_booking"
                  label="Kode Booking"
                  id="code_booking"
                  placeholder="Kode Booking"
                  :error="errors.tickets?.[index]?.code_booking"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <InputDate
                  label_status="false"
                  v-model="ticket.departure_date"
                  id="departure_date"
                  label="Tanggal Berangkat"
                  :error="errors.tickets?.[index]?.departure_date"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <InputText
                  label_status="false"
                  v-model="ticket.travel_price_display"
                  label="Harga Travel"
                  id="travel_price"
                  placeholder="Harga Travel"
                  :error="errors.tickets?.[index]?.travel_price"
                  @input="(e) => updateHargaTravel(e, index)"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                <InputText
                  label_status="false"
                  v-model="ticket.customer_price_display"
                  label="Harga Customer"
                  id="customer_price"
                  placeholder="Harga Customer"
                  :error="errors.tickets?.[index]?.customer_price"
                  @input="(e) => updateHargaCostumer(e, index)"
                />
              </td>
              <td class="px-3 pb-3 pt-5 border-b align-top text-center">
                {{ formatRupiah(ticket.customer_price * ticket.pax) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="p-3 border-b" colspan="2">
                <PrimaryButton @click="addTicket">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tambah Row
                </PrimaryButton>
              </td>
              <td class="p-3 font-bold border-b text-right" colspan="5">Total:</td>
              <td class="p-3 border-b text-center">
                {{ formatRupiah(totalSemuaTiket) }}
              </td>
            </tr>
          </tfoot>
        </table>
        <!-- Customer Data -->
        <div class="mt-0 pt-3">
          <div class="flex flex-wrap gap-4 items-end">
            <SelectField
              label="Kostumer"
              v-model="form.customer.kostumer_id"
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
              v-model="form.customer.paket_id"
              :options="paketOption"
              class="flex-1 min-w-[200px]"
            />
            <div class="flex-1 min-w-[200px]">
              <InputText
                v-model.number="form.customer.dibayar"
                :error="errors.dibayar"
                id="dibayar"
                label="Dibayar"
                placeholder="Dibayar"
              />
            </div>
            <div class="flex flex-col flex-1 min-w-[200px]">
              <label for="sisa" class="text-sm font-medium text-gray-700 mb-1">Sisa</label>
              <div
                id="sisa"
                class="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300"
              >
                {{ formatRupiah(calculateSisa) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, toRaw, onMounted, computed } from 'vue'
import {
  add_tiket,
  generate_nomor_register,
  generate_nomor_invoice,
  daftar_costumer,
  daftar_paket,
} from '@/service/trans_tiket'
import { paramCabang } from '@/service/param_cabang'
import Form from '@/components/Modal/Form.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import SelectField from '@/components/Form/SelectField.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/User/Modules/Member/Icon/DeleteIcon.vue'

// ✅ Props dari parent
const props = defineProps<{
  showForm: boolean
  formData: TicketTransactionForm
  maskapaiList: Maskapai[]
}>()

function updateHargaTravel(e: any, index: any) {
  const raw = e.target.value.replace(/[^\d]/g, '')
  const formatted = dinamicformatRupiah(raw)
  form.value.tickets[index].travel_price = parseInt(raw) || 0
  form.value.tickets[index].travel_price_display = formatted
}

function updateHargaCostumer(e: any, index: any) {
  const raw = e.target.value.replace(/[^\d]/g, '')
  const formatted = dinamicformatRupiah(raw)
  form.value.tickets[index].customer_price = parseInt(raw) || 0
  form.value.tickets[index].customer_price_display = formatted
}

function dinamicformatRupiah(value: any) {
  const angka = parseInt(value || '0')
  const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
  return currency
}

export interface TicketTransactionForm {
  id: number
  tickets: TicketForm[]
  customer: CustomerForm
  nomor_register: string
  invoice: string
}

// Definisikan tipe untuk Maskapai
export interface Maskapai {
  id: number
  name: string
  company_id: number
}

interface TicketForm {
  pax: number
  airlines_id: string
  code_booking: string
  departure_date: Date | null
  travel_price: number
  travel_price_display?: string
  customer_price: number
  customer_price_display?: string
}

interface CustomerForm {
  kostumer_id: number
  paket_id: number
  dibayar: number
}

interface ErrorFields {
  kostumer_id?: string
  dibayar?: string
  tickets?: {
    pax?: string
    maskapai?: string
    code_booking?: string
    departure_date?: string
    travel_price?: string
    customer_price?: string
  }[]
}

const errors = ref<ErrorFields>({
  kostumer_id: '',
  dibayar: '',
  tickets: [],
})

// Definisikan tipe untuk form yang sesuai dengan semua field di template
interface FormData {
  id: number
  tickets: TicketForm[]
  customer: CustomerForm
  nomor_register: string
  invoice: string
}

const emit = defineEmits<{
  (e: 'save', data: FormData): void
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()

// ✅ Data form yang akan ditampilkan
const form = ref<FormData>({
  id: 0,
  tickets: [],
  customer: {
    kostumer_id: 0,
    paket_id: 0,
    dibayar: 0,
  },
  nomor_register: '',
  invoice: '',
})

// Add new ticket row
function addTicket() {
  form.value.tickets.push(createEmptyTicket())
}
// Remove ticket row
function removeTicket(index: number) {
  form.value.tickets.splice(index, 1)
}

function handleCancel() {
  emit('cancel')
  errors.value = {
    kostumer_id: '',
  }
}
// Function to create a blank ticket row
function createEmptyTicket(): TicketForm {
  return {
    pax: 1,
    airlines_id: '0',
    code_booking: '',
    departure_date: null,
    travel_price: 0,
    travel_price_display: dinamicformatRupiah(0),
    customer_price: 0,
  }
}

function initializeForm(data: TicketTransactionForm) {
  const fixedTickets: TicketForm[] =
    data.tickets && data.tickets.length > 0
      ? data.tickets.map((ticket) => ({
          pax: ticket.pax,
          airlines_id: ticket.airlines_id,
          code_booking: ticket.code_booking ?? '',
          departure_date: null,
          travel_price: ticket.travel_price,
          customer_price: ticket.customer_price,
        }))
      : [createEmptyTicket()]
  form.value = {
    id: 0,
    tickets: fixedTickets,
    customer: {
      kostumer_id: data.customer?.kostumer_id ?? 0,
      paket_id: data.customer?.paket_id ?? 0,
      dibayar: data.customer?.dibayar ?? 0,
    },
    nomor_register: data.nomor_register ?? '',
    invoice: data.invoice ?? '',
  }
}

watch(
  () => props.showForm,
  async (val) => {
    if (val) {
      if (!props.formData.nomor_register) {
        try {
          const res = await generate_nomor_register()
          props.formData.nomor_register = res.data.nomor_register
        } catch (error) {
          console.error('Gagal generate nomor register:', error)
        }
      }
      if (!props.formData.invoice) {
        try {
          const res = await generate_nomor_invoice()
          props.formData.invoice = res.data.invoice
        } catch (error) {
          console.error('Gagal generate nomor invoice:', error)
        }
      }
      initializeForm(props.formData)
    }
  },
)

const totalSemuaTiket = computed(() => {
  return form.value.tickets.reduce((total, ticket) => {
    return total + ticket.customer_price * ticket.pax
  }, 0)
})

const calculateSisa = computed(() => {
  const totalHarga = form.value.tickets.reduce((sum, t) => {
    return sum + t.pax * t.customer_price
  }, 0)
  return totalHarga - form.value.customer.dibayar
})

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.value = {
    kostumer_id: '',
    dibayar: '',
    tickets: [],
  }

  // Validate customer fields
  if (!form.value.customer.kostumer_id || form.value.customer.kostumer_id === 0) {
    errors.value.kostumer_id = 'Kostumer wajib dipilih'
    isValid = false
  }

  if (form.value.customer.dibayar < 0) {
    errors.value.dibayar = 'Jumlah dibayar tidak boleh negatif'
    isValid = false
  }

  // Validate each ticket row
  form.value.tickets.forEach((ticket, index) => {
    const ticketErrors: ErrorFields['tickets'][0] = {}

    if (!ticket.pax || ticket.pax <= 0) {
      ticketErrors.pax = 'Jumlah pax wajib lebih dari 0'
      isValid = false
    }

    if (ticket.airlines_id == '0') {
      ticketErrors.maskapai = 'Maskapai wajib dipilih'
    }

    if (!ticket.code_booking.trim()) {
      ticketErrors.code_booking = 'Kode booking wajib diisi'
      isValid = false
    }

    if (!ticket.departure_date) {
      ticketErrors.departure_date = 'Tanggal berangkat wajib diisi'
      isValid = false
    }

    if (ticket.travel_price <= 0) {
      ticketErrors.travel_price = 'Harga travel wajib lebih dari 0'
      isValid = false
    }

    if (ticket.customer_price <= 0) {
      ticketErrors.customer_price = 'Harga customer wajib lebih dari 0'
      isValid = false
    }

    errors.value.tickets![index] = ticketErrors
  })

  return isValid
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    const transactionData = new FormData()
    if (form.value.id) {
      transactionData.append('id', form.value.id.toString())
    }
    transactionData.append('tickets', JSON.stringify(form.value.tickets))
    transactionData.append('customer', JSON.stringify(form.value.customer))
    transactionData.append('nomor_register', form.value.nomor_register)
    transactionData.append('invoice', form.value.invoice)

    console.log('-----------------1')
    console.log(form.value.id)
    console.log('-----------------1')
    console.log('Log Form data objek')
    console.log(JSON.stringify(form.value))
    console.log('Log Form data pair')
    for (let pair of transactionData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    const response = await add_tiket(transactionData)
    emit('submitted')
  } catch (error) {
    console.error('Gagal menyimpan data member:', error)
  }
}

watch(
  () => form.value.tickets,
  (tickets) => {
    tickets.forEach((ticket, index) => {
      if (typeof ticket.maskapai === 'object' && ticket.maskapai !== null) {
        form.value.tickets[index].airlines_id = ticket.maskapai.id
      } else if (typeof ticket.maskapai === 'string' || typeof ticket.maskapai === 'number') {
        form.value.tickets[index].airlines_id = Number(ticket.maskapai)
      }
    })
  },
  { deep: true },
)
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(value)
}

interface costumer {
  id: number
  name: string
}

const customerOption = ref<costumer[]>([])
const SelectedCustomer = ref(0)
const fetchCustomer = async () => {
  try {
    const response = await daftar_costumer()
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

onMounted(async () => {
  await fetchCustomer()
  await fetchCabang()
})
</script>
