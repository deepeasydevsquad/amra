<template>
  <Form
    :formStatus="true"
    :label="'Form Transaksi Deposit Saldo'"
    :width="'w-full max-w-md'"
    :submitLabel="'Tambah Deposit'"
    @cancel="emit('close')"
    @submit="handleSubmit"
  >
    <!-- Select Cabang -->
    <SelectField v-model="selectedCabang" label="Pilih Cabang" :options="optionCabang" />

    <!-- Select Member -->
    <SelectField
      v-model="form.memberId"
      label="Pilih Member"
      :options="filteredMembers"
      optionLabel="nama_member"
      optionValue="id"
    />

    <!-- Input Nominal -->
    <InputText
      v-model="computedNominal"
      label="Biaya Deposit (Rp)"
      placeholder="Masukkan nominal"
      required
    />
    <p class="text-xs text-gray-500 mt-1">Minimal deposit Rp1.000</p>

    <!-- Input Info -->
    <InputText
      v-model="form.info"
      label="Keterangan (Opsional)"
      placeholder="Contoh: Deposit awal"
      textarea
    />
  </Form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { addDeposit, get_member } from '@/service/deposit_saldo'
import { paramCabang } from '@/service/param_cabang'
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'

const emit = defineEmits(['close', 'success'])

const form = ref({
  memberId: '',
  nominal: 0,
  info: '',
})

interface Member {
  id: string
  name: string
}

interface Cabang {
  id: number
  name: string
}

const optionCabang = ref<Cabang[]>([])
const selectedCabang = ref('')
const filteredMembers = ref<Member[]>([])

const fetchCabang = async () => {
  const res = await paramCabang()
  optionCabang.value = res.data
  if (res.length > 0) selectedCabang.value = res[0].id
}

const fetchMembers = async () => {
  if (!selectedCabang.value) return
  const res = await get_member({ id_cabang: selectedCabang.value })
  filteredMembers.value = res
}

const computedNominal = computed({
  get() {
    return form.value.nominal
      ? 'Rp ' + form.value.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : ''
  },
  set(value: string) {
    const clean = value.replace(/[^\d]/g, '')
    form.value.nominal = Number(clean)
  },
})

const handleSubmit = async () => {
  try {
    const payload = {
      memberId: form.value.memberId,
      division_id: selectedCabang.value,
      nominal: form.value.nominal,
      info: form.value.info,
    }

    const res = await addDeposit(payload)
    window.open('/invoice-deposit/' + res.data.invoice, '_blank')
    emit('success')
  } catch (e) {
    console.error('Gagal tambah deposit', e)
  }
}

onMounted(async () => {
  await fetchCabang()
})

watch(selectedCabang, async (val) => {
  if (val) {
    await fetchMembers()
  }
})
</script>
