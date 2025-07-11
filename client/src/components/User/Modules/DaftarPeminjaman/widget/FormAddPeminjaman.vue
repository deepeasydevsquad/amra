<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, computed, watch } from 'vue'
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import SelectField from '@/components/Form/SelectField.vue'

import { addPinjaman, daftar_jamaah } from '@/service/daftar_pinjaman'
import { userTypes, paramCabang } from '@/service/param_cabang'
import { idText } from 'typescript'

defineProps({
  modalTambahPinjaman: Boolean,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'tutup'): void
}>()

interface Jamaah {
  id: number
  nama_jamaah: string
}

interface Cabang {
  id: number
  name: string
}

const selectedCabang = ref<number | null>(null)
const cabangs = ref<Cabang[]>([])
const jamaahs = ref<Jamaah[]>([])
const selectedJamaah = ref<number | 0>(0)
const nominal = ref<number | null>(null)
const dp = ref<number | null>(null)
const mulaiBayar = ref<string>(new Date().toISOString().slice(0, 10))
const tenor = ref<number | null>(null)
const berangkat = ref<boolean>(false)

const fetchJamaahs = async (cabang_id: number | null) => {
  if (!cabang_id) return

  try {
    const res = await daftar_jamaah({ id_cabang: cabang_id })
    jamaahs.value = res
    console.log('Jamaahs:', jamaahs.value)
  } catch (err) {
    console.error('Gagal ambil data jamaah:', err)
  }
}

// Format ke rupiah
const formatRupiah = (val: number | null) => {
  if (val === null) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}

// Controlled input: nominal & dp (bentuk formatted string biar bisa tampil di InputText)
const nominalFormatted = computed({
  get: () => formatRupiah(nominal.value),
  set: (val: string) => updateNominal(val),
})
const dpFormatted = computed({
  get: () => formatRupiah(dp.value),
  set: (val: string) => updateDP(val),
})

const updateNominal = (val: string) => {
  const n = parseInt(val.replace(/[^0-9]/g, ''), 10)
  nominal.value = isNaN(n) ? null : n
}

const updateDP = (val: string) => {
  const n = parseInt(val.replace(/[^0-9]/g, ''), 10)
  dp.value = isNaN(n) ? null : n
}

const resetForm = () => {
  selectedCabang.value = null
  selectedJamaah.value = 0
  nominal.value = null
  dp.value = null
  tenor.value = null
  mulaiBayar.value = new Date().toISOString().slice(0, 10)
  berangkat.value = false
}

const errors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  let isValid = true

  // Kosongkan errors sebelum validasi
  errors.value = {}

  // Tambah error jamaah jika belum dipilih
  if (selectedJamaah.value == 0) {
    errors.value.jamaah = 'Anda wajib memilih salah satu jamaah.'
    isValid = false
  }

  // Tambah error nominal jika 0
  if (nominal.value == null) {
    errors.value.nominal = 'Nominal tidak boleh nol.'
    isValid = false
  }

  // Tambah error dp jika 0
  if (dp.value == null) {
    errors.value.dp = 'DP tidak boleh nol.'
    isValid = false
  }

  // Tambah error tenor jika 0
  if (tenor.value == null) {
    errors.value.tenor = 'Tenor tidak boleh nol.'
    isValid = false
  }

  // Tambah error mulaiBayar jika kosong
  if (mulaiBayar.value === '') {
    errors.value.mulaiBayar = 'Anda wajib mengisi tanggal mulai bayar.'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  const formData = {
    jamaah_id: selectedJamaah.value,
    id_cabang: selectedCabang.value,
    nominal: nominal.value,
    dp: dp.value,
    tenor: tenor.value,
    mulai_bayar: mulaiBayar.value,
    sudah_berangkat: berangkat.value,
  }

  try {
    await addPinjaman(formData)
    resetForm()
    emit('close')
  } catch (err) {
    console.error('Gagal tambah pinjaman:', err)
  }
}

onMounted(async () => {
  try {
    const res = await paramCabang()
    cabangs.value = res.data
  } catch (err) {
    console.error('Gagal ambil data cabang:', err)
  }
})

watch(selectedCabang, (val) => {
  fetchJamaahs(val)
})

const cabangOptions = computed(() => [{ id: null, name: 'Pilih Cabang' }, ...cabangs.value])

const jamaahOptions = computed(() => [
  { id: 0, name: 'Pilih Jamaah' },
  ...jamaahs.value.map((j) => ({
    id: j.id,
    name: j.nama_jamaah,
  })),
])
</script>
<template>
  <Form
    :formStatus="modalTambahPinjaman"
    :label="'Tambah Peminjaman'"
    :width="'w-1/3'"
    :submitLabel="'TAMBAH PEMINJAMAN'"
    @submit="submitForm"
    @cancel="
      () => {
        resetForm()

        emit('tutup')
      }
    "
  >
    <SelectField
      v-model="selectedCabang"
      label="Cabang"
      placeholder="Pilih Cabang"
      :options="cabangOptions"
    />

    <!-- Satu baris -->
    <SelectField
      v-model="selectedJamaah"
      label="Jamaah"
      placeholder="Pilih Jamaah"
      :options="jamaahOptions"
      class="mb-3"
      :error="errors.jamaah"
    />

    <InputText
      v-model="nominalFormatted"
      label="Nominal Peminjaman"
      placeholder="Masukkan nominal"
      @update:modelValue="updateNominal"
      class="mb-3"
      :error="errors.nominal"
    />
    <!-- Grid 2 kolom: DP & Tenor -->
    <div class="grid grid-cols-2 gap-4 mb-3">
      <InputText
        v-model="dpFormatted"
        label="DP"
        placeholder="Masukkan DP"
        @update:modelValue="updateDP"
        :error="errors.dp"
      />
      <InputText
        v-model="tenor"
        label="Tenor"
        type="number"
        placeholder="Tenor"
        :error="errors.tenor"
      />
    </div>
    <!-- Grid 2 kolom: Sudah Berangkat & Mulai Bayar -->
    <div class="grid grid-cols-2 gap-4">
      <div class="pt-6">
        <!-- <== padding atas untuk sejajarin -->
        <div class="flex items-center gap-2">
          <input
            v-model="berangkat"
            type="checkbox"
            id="sudah_berangkat"
            class="h-5 w-5 text-blue-600 border-gray-300 rounded"
          />
          <label for="sudah_berangkat" class="text-sm text-gray-700">Sudah Berangkat</label>
        </div>
      </div>
      <InputDate v-model="mulaiBayar" label="Mulai Bayar" :error="errors.mulaiBayar" />
    </div>
  </Form>
</template>
