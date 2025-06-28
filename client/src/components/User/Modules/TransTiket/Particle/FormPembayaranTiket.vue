<script setup lang="ts">
import Form from '@/components/Modal/Form.vue'
import InputReadonly from '@/components/Form/InputReadonly.vue'
import InputCurrency from '@/components/Form/InputCurrency.vue'
import { ref, watch, onMounted } from 'vue'
import { add_pembayaran } from '@/service/trans_tiket'

const props = defineProps<{
  formData: {
    ticket_transaction_id: number
    nominal: number
    costumer_name: string
    costumer_identity: string
  }
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()

// sisa akan dihitung otomatis dari total transaksi - nominal
const sisa_awal = ref(props.formData.nominal) // asumsi nominal = sisa awal

const form = ref({
  ticket_transaction_id: props.formData.ticket_transaction_id,
  nominal: 0,
  nominal_sisa: props.formData.nominal,
  costumer_name: props.formData.costumer_name,
  costumer_identity: props.formData.costumer_identity,
})

onMounted(() => {
  console.log('form pembayaran tiket:', form.value)
})
watch(
  () => form.value.nominal,
  (val) => {
    if (val > sisa_awal.value) {
      form.value.nominal = 0
      form.value.nominal_sisa = sisa_awal.value
    } else {
      form.value.nominal_sisa = sisa_awal.value - val
    }
  },
)

watch(
  () => props.formData,
  (val) => {
    sisa_awal.value = val.nominal
    form.value = {
      ticket_transaction_id: val.ticket_transaction_id,
      nominal: 0,
      nominal_sisa: val.nominal,
      costumer_name: val.costumer_name,
      costumer_identity: val.costumer_identity,
    }
  },
  { immediate: true },
)

const formatRupiah = (val: number): string => 'Rp ' + val.toLocaleString('id-ID')

const submit = async () => {
  try {
    if (form.value.nominal === 0) {
      alert('Nominal bayar tidak boleh kosong')
      return
    }
    const res = await add_pembayaran(form.value)
    console.log(res)
    emit('submitted')
  } catch (error) {
    console.error('Error saat submit:', error)
  }
}
</script>

<template>
  <Form
    :label="'Pembayaran Tiket'"
    :submitLabel="'Simpan'"
    :width="'w-1/2'"
    @cancel="emit('cancel')"
    @submit="submit"
  >
    <!-- Baris: Nama & Identitas -->
    <div class="grid grid-cols-2 gap-4">
      <InputReadonly label="Nama Customer" id="nama" :value="form.costumer_name" />
      <InputReadonly label="Nomor Identitas" id="identitas" :value="form.costumer_identity" />
    </div>

    <!-- Baris: Nominal Bayar & Sisa -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <!-- Ganti input nominal bayar -->
      <InputCurrency label="Nominal Bayar" id="nominal" v-model="form.nominal" />

      <InputReadonly
        label="Sisa Nominal"
        id="nominal_sisa"
        :value="formatRupiah(form.nominal_sisa)"
      />
    </div>
  </Form>
</template>
