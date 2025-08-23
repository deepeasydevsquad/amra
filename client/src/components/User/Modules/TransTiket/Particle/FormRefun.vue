<script setup lang="ts">
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { daftar_costumer, detail_refund, refund } from '@/service/trans_tiket'
import SelectField from '@/components/Form/SelectField.vue'

const props = defineProps<{
  nomor_register: string
  formStatus: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()

const parseRupiah = (val: string): number => {
  return parseInt(val.replace(/[^\d]/g, '')) || 0
}

const detailList = ref<any[]>([])

const namaPelanggan = ref('')
const identitasFee = ref('')
const sudahDibayar = ref(0)
const sisaPembayaran = ref(0)
const costumer_id = ref(0)

watch(
  [() => props.formStatus, () => props.nomor_register],
  async ([open, nomorRegisterNow]) => {
    if (open && nomorRegisterNow) {
      try {
        const res = await detail_refund({ nomor_register: nomorRegisterNow })

        namaPelanggan.value = res.nama_pelanggan ?? ''
        identitasFee.value = ''
        sudahDibayar.value = parseRupiah(res.total_dibayar)
        sisaPembayaran.value = parseRupiah(res.detail[0]?.sisa_tagihan)
        detailList.value = (res.detail ?? []).map((d: any) => ({
          ...d,
          refund: 0,
          fee: 0,
        }))
      } catch (err) {
        console.error('❌ Gagal ambil refund:', err)
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

const resetForm = () => {
  namaPelanggan.value = ''
  identitasFee.value = ''
  sudahDibayar.value = 0
  sisaPembayaran.value = 0
  detailList.value = []
}

const totalRefund = computed(() => {
  return detailList.value.reduce((acc, item) => acc + (parseInt(item.refund) || 0), 0)
})

const totalFee = computed(() => {
  return detailList.value.reduce((acc, item) => acc + (parseInt(item.fee) || 0), 0)
})

const totalRefundFormatted = computed({
  get() {
    return 'Rp ' + totalRefund.value.toLocaleString('id-ID')
  },
  set(val: string) {
    const value = parseRupiah(val)
    detailList.value.forEach((item) => (item.refund = value))
  },
})

const totalFeeFormatted = computed({
  get() {
    return 'Rp ' + totalFee.value.toLocaleString('id-ID')
  },
  set(val: string) {
    const value = parseRupiah(val)
    detailList.value.forEach((item) => (item.fee = value))
  },
})

const sudahDibayarFormatted = computed({
  get() {
    return 'Rp ' + sudahDibayar.value.toLocaleString('id-ID')
  },
  set(val: string) {
    sudahDibayar.value = parseRupiah(val)
  },
})

const sisaPembayaranFormatted = computed({
  get() {
    return 'Rp ' + sisaPembayaran.value.toLocaleString('id-ID')
  },
  set(val: string) {
    sisaPembayaran.value = parseRupiah(val)
  },
})

const submitRefund = async () => {
  if (!props.nomor_register) {
    alert('❌ Nama pelanggan, identitas, dan nomor register wajib diisi.')
    return
  }

  const detail = detailList.value.map((item) => ({
    refund: parseInt(item.refund) || 0,
    fee: parseInt(item.fee) || 0,
  }))

  const payload = {
    nomor_register: props.nomor_register,
    detail,
  }

  // console.log("Payload to submit:");
  // console.log(payload);
  // console.log("Payload to submit:");


  await refund(payload)
  // console.log('✅ Submit refund:', payload)

  emit('submitted')
  resetForm()
}

const getFormatted = (value: number) => 'Rp ' + (value || 0).toLocaleString('id-ID')
const toNumber = (val: string) => parseInt(val.replace(/[^\d]/g, '')) || 0

const getRefundModel = (item: any) =>
  computed({
    get: () => getFormatted(item.refund),
    set: (val: string) => {
      item.refund = toNumber(val)
    },
  })

const getFeeModel = (item: any) =>
  computed({
    get: () => getFormatted(item.fee),
    set: (val: string) => {
      item.fee = toNumber(val)
    },
  })

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

const handleCancle = async () => {
  resetForm()
  emit('cancel')
}

onMounted(async () => {
  await fetchCustomer()
})
</script>

<template>
  <div class="text-black">
    <Form :formStatus="props.formStatus" :label="'Form Refund Tiket'" :width="'w-xl'" :submitLabel="'REFUND'" @submit="submitRefund" @cancel="handleCancle">
      <div class="inline-block border border-red-500 text-red-500 px-2 py-1 rounded font-semibold mb-4">
        Nomor Register: {{ props.nomor_register }}
      </div>
      <table class="w-full border-collapse bg-white text-center text-sm text-gray-500">
        <thead class="bg-gray-50 text-center">
          <tr class="bg-gray-100">
            <th class="w-[7%] text-center py-2 font-medium border text-gray-900 bg-gray-100">Pax</th>
            <th class="w-[38%] text-center py-2 font-medium border text-gray-900 bg-gray-100">
              Info Tiket (Maskapai)
            </th>
            <th class="w-[35%] text-center py-2 font-medium border text-gray-900 bg-gray-100">
              Info Tiket (Keberangkatan)
            </th>
            <th class="w-[25%] text-center py-2 font-medium border text-gray-900 bg-gray-100">Refund</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in detailList" :key="index" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b text-center align-top">
              <div class="font-medium text-gray-800">{{ item.pax }}</div>
            </td>
            <td class="px-4 py-2 border-b text-left align-top">
              <table class="w-full mb-0">
                <tbody>
                  <tr>
                    <td class="w-[60%] border-b px-4 py-2">Kode Booking</td>
                    <td class="text-center border-b py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm border-b px-4 py-2">{{ item.code_booking }}</td>
                  </tr>
                  <tr>
                    <td class="border-b px-4 py-2">Maskapai</td>
                    <td class="text-center border-b py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm border-b px-4 py-2">{{ item.maskapai }}</td>
                  </tr>
                  <tr>
                    <td class=" px-4 py-2">Tanggal Berangkat</td>
                    <td class="text-center py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm px-4 py-2">{{ item.tanggal_berangkat }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td class="px-4 py-2 border-b text-left align-top">
              <table class="w-full mb-0">
                <tbody>
                  <tr>
                    <td class="w-[60%] border-b px-4 py-2">Harga Travel</td>
                    <td class="text-center border-b py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm border-b px-4 py-2">{{ item.harga_travel }}</td>
                  </tr>
                  <tr>
                    <td class="border-b px-4 py-2">Harga Costumer</td>
                    <td class="text-center border-b py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm border-b px-4 py-2">{{ item.harga_costumer }}</td>
                  </tr>
                  <tr>
                    <td class="border-b px-4 py-2">Total Harga Tiket</td>
                    <td class="text-center border-b py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm border-b px-4 py-2">{{ item.total_harga_tiket }}</td>
                  </tr>
                  <tr>
                    <td class=" px-4 py-2">Total Fee Tiket</td>
                    <td class="text-center py-2 px-0">:</td>
                    <td class="text-right space-y-2 text-sm  px-4 py-2">{{ item.total_fee_tiket }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="px-4 py-2 border-b text-left align-top">
              <InputText placeholder="Refund" :modelValue="getRefundModel(item).value" @update:modelValue="getRefundModel(item).value = $event" :label="'Refund'" :class="'mb-4'" />
              <InputText :class="'mb-4'" placeholder="Fee" :modelValue="getFeeModel(item).value" @update:modelValue="getFeeModel(item).value = $event" :label="'Fee'" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <InputText placeholder="Total Di Refund" v-model="totalRefundFormatted" :readonly="true" :label="'Total di Refund'"/>
          <InputText placeholder="Total Fee" v-model="totalFeeFormatted" :readonly="true" :label="'Total fee'" />
          <InputText placeholder="Sudah Di Bayar" v-model="sudahDibayarFormatted" :readonly="true" :label="'Sudah dibayar'" />
          <InputText placeholder="Sisa Pembayaran" v-model="sisaPembayaranFormatted" :readonly="true" :label="'Sisa pembayaran'" />
        </div>
      </div>
    </Form>
  </div>
</template>
