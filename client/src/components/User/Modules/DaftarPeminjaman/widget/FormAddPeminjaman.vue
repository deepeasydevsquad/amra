<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue'
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import SelectField from '@/components/Form/SelectField.vue'

import { addPinjaman, daftar_jamaah } from '@/service/daftar_pinjaman'

const props = defineProps({
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

const jamaahs = ref<Jamaah[]>([])
const selectedJamaah = ref<number | 0>(0)
const nominal = ref<number | null>(null)
const dp = ref<number | null>(null)
const mulaiBayar = ref<string>(new Date().toISOString().slice(0, 10))
const tenor = ref<number | null>(null)
const berangkat = ref<boolean>(false)

// // Format dropdown jamaah
// const jamaahOptions = computed(() =>
//   jamaahs.value.map((j: any) => ({ label: j.nama_jamaah, value: j.id })),
// )

const fetchJamaahs = async () => {
  try {
    const res = await daftar_jamaah()
    jamaahs.value = res
    console.log('Jamaahs:', jamaahs.value)
  } catch (err) {
    console.error('Gagal ambil data jamaah:', err)
  }
}

onMounted(fetchJamaahs)

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
  selectedJamaah.value = 0
  nominal.value = null
  dp.value = null
  tenor.value = null
  mulaiBayar.value = new Date().toISOString().slice(0, 10)
  berangkat.value = false
}

const submitForm = async () => {
  const formData = {
    jamaah_id: selectedJamaah.value,
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

const jamaahOptions = computed(() =>
  jamaahs.value.map((j) => ({
    id: j.id,
    name: j.nama_jamaah,
  })),
)
</script>
<template>
  <Form
    :formStatus="modalTambahPinjaman"
    :label="'Tambah Peminjaman'"
    :width="'w-1/3'"
    :submitLabel="'Tambah'"
    @submit="submitForm"
    @cancel="
      () => {
        resetForm()
        emit('tutup')
      }
    "
  >
    <!-- Satu baris -->
    <SelectField
      v-model="selectedJamaah"
      label="Jamaah"
      placeholder="Pilih Jamaah"
      :options="jamaahOptions"
    />

    <InputText
      v-model="nominalFormatted"
      label="Nominal Peminjaman"
      placeholder="Masukkan nominal"
      @update:modelValue="updateNominal"
    />

    <!-- Grid 2 kolom: DP & Tenor -->
    <div class="grid grid-cols-2 gap-4">
      <InputText
        v-model="dpFormatted"
        label="DP"
        placeholder="Masukkan DP"
        @update:modelValue="updateDP"
      />
      <InputText v-model="tenor" label="Tenor" type="number" placeholder="Tenor" />
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

      <InputDate v-model="mulaiBayar" label="Mulai Bayar" />
    </div>
  </Form>
</template>
