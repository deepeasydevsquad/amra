<script setup lang="ts">
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { paramCabang } from '@/service/param_cabang'
import { daftar_staff, add_pembayaran_gaji } from '@/service/pembayaran_gaji'

defineProps<{
  modalPembayaran: boolean
}>()

const emit = defineEmits(['cancel', 'submit'])

interface cabang {
  id: number
  name: string
}

const optionCabang = ref<cabang[]>([])
const selectedCabangId = ref(0)

const fetchCabang = async () => {
  const res = await paramCabang()
  optionCabang.value = [
    { id: 0, name: 'Pilih Cabang' },
    ...res.data.map((item: any) => ({
      id: item.id,
      name: `${item.name}`,
    })),
  ]
}

interface staff {
  id: number
  name: string
}

const optionStaff = ref<staff[]>([{ id: 0, name: 'Pilih Staff' }])
const selectedStaffId = ref(0)

const errorCabang = ref('')
const errorStaff = ref('')

const fetchStaff = async () => {
  const res = await daftar_staff({
    division_id: selectedCabangId.value,
  })
  optionStaff.value = [
    { id: 0, name: 'Pilih Staff' },
    ...res.data.map((item: any) => ({
      id: item.id,
      name: `${item.name}`,
    })),
  ]
}

watch(selectedCabangId, () => {
  selectedStaffId.value = 0
  fetchStaff()
})

onMounted(() => {
  fetchCabang()
})

// ✅ validasi sebelum submit
const handleSubmit = async () => {
  let valid = true
  errorCabang.value = ''
  errorStaff.value = ''
  errorNominal.value = ''

  if (selectedCabangId.value === 0) {
    errorCabang.value = 'Cabang wajib dipilih'
    valid = false
  }

  if (selectedStaffId.value === 0) {
    errorStaff.value = 'Staff wajib dipilih'
    valid = false
  }

  if (!nominalGaji.value || isNaN(nominalGaji.value)) {
    errorNominal.value = 'Nominal wajib diisi dengan angka'
    valid = false
  }

  if (!valid) return

  try {
    const payload = {
      division_id: selectedCabangId.value,
      user_id: selectedStaffId.value,
      nominal: Number(nominalGaji.value),
    }

    await add_pembayaran_gaji(payload)

    // ✅ emit close biar nutup modal
    emit('submit')

    // ✅ reset form biar siap next
    resetForm()
  } catch (err) {
    console.error('Gagal simpan:', err)
  }
}

const resetForm = () => {
  selectedCabangId.value = 0
  selectedStaffId.value = 0
  nominalGaji.value = null
  optionStaff.value = [{ id: 0, name: 'Pilih Staff' }]
  errorCabang.value = ''
  errorStaff.value = ''
  errorNominal.value = ''
}

const nominalGaji = ref<number | null>(null)
const errorNominal = ref('')

// helper buat format Rp
const formatRupiah = (angka: number | null): string => {
  if (angka === null) return ''
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// helper buat ngubah dari string ke number
const parseRupiah = (str: string): number => {
  const clean = str.replace(/[^0-9]/g, '')
  return Number(clean)
}

const formattedNominal = computed({
  get() {
    return nominalGaji.value !== null ? formatRupiah(nominalGaji.value) : ''
  },
  set(value: string) {
    nominalGaji.value = parseRupiah(value)
  },
})
</script>

<template>
  <Form
    :formStatus="modalPembayaran"
    :label="'Pembayaran Gaji'"
    width="sm:w-1/3 sm:max-w-1/3"
    @close="$emit('cancel')"
    @cancel="
      () => {
        $emit('cancel')
        resetForm()
      }
    "
    @submit="handleSubmit"
    :submitLabel="'PROSES'"
  >
    <SelectField
      v-model="selectedCabangId"
      label="Cabang"
      placeholder="Pilih cabang"
      class="mt-4"
      :options="optionCabang"
      :error="errorCabang"
    />

    <SelectField
      v-model="selectedStaffId"
      label="Staff"
      placeholder="Pilih staff"
      class="mt-4"
      :options="optionStaff"
      :error="errorStaff"
    />

    <InputText
      v-model="formattedNominal"
      label="Nominal Gaji"
      placeholder="Masukkan nominal"
      class="mt-4"
      :error="errorNominal"
    />
  </Form>
</template>
