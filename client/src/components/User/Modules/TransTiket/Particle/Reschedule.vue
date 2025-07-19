<script setup lang="ts">
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { reschedule, detail_reschedule, daftar_costumer } from '@/service/trans_tiket'
import SelectField from '@/components/Form/SelectField.vue'

const props = defineProps<{
  nomor_register: string
  formStatus: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()

interface DetailItem {
  id: number
  pax: number
  code_booking: string
  departure_date: Date
  travel_price: number
  costumer_price: number
  airline: string
}

interface FormData {
  id: number
  total_tagihan: number
  sudah_bayar: number
  sisa_pembayaran: number
  detail: DetailItem[]
}

const formData = ref<FormData | null>(null)

watch(
  () => props.formStatus,
  async (val) => {
    if (val && props.nomor_register) {
      try {
        const res = await detail_reschedule({ nomor_register: props.nomor_register })
        const data = res

        const detailWithParsedDate = data.details.map((d: any) => ({
          ...d,
          departure_date: d.departure_date,
        }))

        formData.value = {
          id: data.id,
          total_tagihan: data.total_tagihan,
          sudah_bayar: data.sudah_bayar,
          sisa_pembayaran: data.sisa_pembayaran,
          detail: detailWithParsedDate,
        }

        console.log('✅ Ambil data reschedule:', data)
      } catch (err) {
        console.error('Gagal ambil data reschedule:', err)
      }
    }
  },
  { immediate: true },
)

const totalKeseluruhan = computed(() => {
  return formData.value?.detail.reduce((acc, item) => acc + item.pax * item.costumer_price, 0) || 0
})

function formatRupiah(value: number): string {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
}

function parseRupiah(value: string): number {
  return parseInt(value.replace(/[Rp,. ]/g, '')) || 0
}

const namaPelanggan = ref('')
const identitasPelanggan = ref('')

const totalTagihanBaru = computed(() => {
  return formData.value?.detail.reduce((acc, item) => acc + item.pax * item.costumer_price, 0) || 0
})

const sisaPembayaran = computed(() => {
  const sudah = formData.value?.sudah_bayar || 0
  return totalTagihanBaru.value - sudah
})

async function handleSubmit() {
  if (!formData.value) return

  const payload = {
    ticket_transaction_id: formData.value.id,
    costumer_name: namaPelanggan.value,
    kostumer_id: SelectedCustomer.value,
    details: formData.value.detail.map((d) => ({
      ticket_transaction_detail_id: d.id,
      departure_date: formatToYYYYMMDD(d.departure_date),
      travel_price: d.travel_price,
      costumer_price: d.costumer_price,
      code_booking: d.code_booking,
    })),
  }

  try {
    await reschedule(payload)
    emit('submitted')
  } catch (err) {
    console.error('❌ Gagal submit reschedule:', err)
  }
}

// Fungsi helper buat format tanggal
function formatToYYYYMMDD(date: string | Date): string {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function resetForm() {
  formData.value = null
  namaPelanggan.value = ''
  identitasPelanggan.value = ''
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

onMounted(async () => {
  await fetchCustomer()
})
</script>

<template>
  <Form
    :formStatus="props.formStatus"
    :label="'Form Reschedule Tiket'"
    :width="'w-3/4'"
    :submitLabel="' Reschedule'"
    @submit="handleSubmit"
    @cancel="
      () => {
        resetForm()
        emit('cancel')
      }
    "
  >
    <table class="w-full border-collapse bg-white text-center text-sm text-gray-500">
      <thead class="bg-gray-50 text-center">
        <tr class="bg-gray-100">
          <th class="px-4 py-4 text-sm font-semibold text-gray-900 text-center">Pax</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">Maskapai</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">Kode Booking</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">Tgl Berangkat</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">H.Travel</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">H.Costumer</th>
          <th class="px-4 py-4 text-sm font-bold text-gray-900 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in formData?.detail" :key="item.id">
          <td class="px-4 py-4 text-sm text-gray-900 text-center">{{ item.pax }}</td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">{{ item.airline }}</td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">
            <InputText v-model="item.code_booking" placeholder="Kode Booking" />
          </td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">
            <InputDate v-model="item.departure_date" />
          </td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">
            <InputText
              placeholder="H.Travel"
              :modelValue="formatRupiah(item.travel_price)"
              @update:modelValue="(val) => (item.travel_price = parseRupiah(val))"
            />
          </td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">
            <InputText
              placeholder="H.Costumer"
              :modelValue="formatRupiah(item.costumer_price)"
              @update:modelValue="(val) => (item.costumer_price = parseRupiah(val))"
            />
          </td>
          <td class="px-4 py-4 text-sm text-gray-900 text-center">
            {{ formatRupiah(item.pax * item.costumer_price) }}
          </td>
        </tr>

        <!-- 🔥 Baris Total -->
        <tr>
          <td colspan="6" class="px-4 py-4 text-sm font-bold text-right text-gray-900 border-t">
            Total
          </td>
          <td class="px-4 py-4 text-sm font-bold text-gray-900 border-t text-center">
            {{ totalKeseluruhan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6 space-y-4">
      <!-- Baris Pertama -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SelectField
          label="Kostumer"
          v-model="SelectedCustomer"
          :options="customerOption"
          class="flex-1 min-w-[200px] -mt-5"
          :note="'Kostumer'"
        />
        <InputText
          :modelValue="formatRupiah(formData?.sudah_bayar || 0)"
          note="Sudah Di Bayar"
          readonly
        />

        <InputText :modelValue="formatRupiah(sisaPembayaran)" note="Sisa Pembayaran" readonly />
      </div>
    </div>
  </Form>
</template>
