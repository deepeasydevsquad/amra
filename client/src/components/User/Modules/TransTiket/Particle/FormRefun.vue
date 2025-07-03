<script setup lang="ts">
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import { ref, watch, computed } from 'vue'
import { detail_refund, refund } from '@/service/trans_tiket'

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
  if (!props.nomor_register || !namaPelanggan.value || !identitasFee.value) {
    alert('❌ Nama pelanggan, identitas, dan nomor register wajib diisi.')
    return
  }

  const detail = detailList.value.map((item) => ({
    refund: parseInt(item.refund) || 0,
    fee: parseInt(item.fee) || 0,
  }))

  const payload = {
    nomor_register: props.nomor_register,
    costumer_name: namaPelanggan.value,
    costumer_identity: identitasFee.value,
    detail,
  }

  await refund(payload)
  console.log('✅ Submit refund:', payload)

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
</script>

<template>
  <div class="text-black">
    <Form
      :formStatus="props.formStatus"
      :label="'Form Refund Tiket'"
      :width="'w-2/3'"
      :submitLabel="' Refund'"
      @submit="submitRefund"
      @cancel="
        () => {
          resetForm()
          emit('cancel')
        }
      "
    >
      <div
        class="inline-block border border-red-500 text-red-500 px-2 py-1 rounded font-semibold mb-4"
      >
        Nomor Register: {{ props.nomor_register }}
      </div>

      <table class="w-full border-collapse bg-white text-center text-sm text-gray-500">
        <thead class="bg-gray-50 text-center">
          <tr class="bg-gray-100">
            <th class="w-[10%] px-1 py-2 text-sm font-semibold text-gray-900 text-center">Pax</th>
            <th class="w-[35%] px-4 py-3 text-sm font-bold text-gray-900 text-center">
              Info Tiket (Maskapai)
            </th>
            <th class="w-[35%] px-4 py-3 text-sm font-bold text-gray-900 text-center">
              Info Tiket (Keberangkatan)
            </th>
            <th class="w-[25%] px-4 py-4 text-base font-bold text-gray-900 text-center">Refund</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in detailList" :key="index" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b text-center align-top">
              <div class="font-medium text-gray-800">{{ item.pax }}</div>
            </td>

            <td class="px-4 py-2 border-b text-left align-top">
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Code Booking</span>:
                {{ item.code_booking }}
              </div>
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Maskapai</span>: {{ item.maskapai }}
              </div>
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Tanggal Berangkat</span>:
                {{ item.tanggal_berangkat }}
              </div>
            </td>

            <td class="px-4 py-2 border-b text-left align-top">
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Harga Travel</span>:
                {{ item.harga_travel }}
              </div>
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Harga Costumer</span>:
                {{ item.harga_costumer }}
              </div>
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Total Harga Tiket</span>:
                {{ item.total_harga_tiket }}
              </div>
              <div class="py-1">
                <span class="inline-block w-36 font-bold">Total Fee Tiket</span>:
                {{ item.total_fee_tiket }}
              </div>
            </td>

            <td class="px-4 py-2 border-b text-left align-top">
              <InputText
                placeholder="Refund"
                :modelValue="getRefundModel(item).value"
                @update:modelValue="getRefundModel(item).value = $event"
                note="Refund"
              />

              <InputText
                placeholder="Fee"
                :modelValue="getFeeModel(item).value"
                @update:modelValue="getFeeModel(item).value = $event"
                note="Fee"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Input tambahan di bawah tabel -->
      <div class="mt-6 space-y-4">
        <!-- Baris Pertama -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputText placeholder="Nama Pelanggan" v-model="namaPelanggan" note="Nama Pelanggan" />
          <InputText
            placeholder="Total Di Refund"
            v-model="totalRefundFormatted"
            note="Total di Refund"
            :readonly="true"
          />
          <InputText
            placeholder="Total Fee"
            v-model="totalFeeFormatted"
            note="Total Fee"
            :readonly="true"
          />
        </div>

        <!-- Baris Kedua -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputText
            placeholder="Identitas Pelanggan"
            v-model="identitasFee"
            note="Identitas Pelanggan"
          />
          <InputText
            placeholder="Sudah Di Bayar"
            v-model="sudahDibayarFormatted"
            note="Sudah di Bayar"
            :readonly="true"
          />
          <InputText
            placeholder="Sisa Pembayaran"
            v-model="sisaPembayaranFormatted"
            note="Sisa Pembayaran"
            :readonly="true"
          />
        </div>
      </div>
    </Form>
  </div>
</template>
