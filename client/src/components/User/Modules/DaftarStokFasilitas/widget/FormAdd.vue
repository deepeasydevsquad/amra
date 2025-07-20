<script setup lang="ts">
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import { add_stock } from '@/service/daftar_stock_fasilitas'
import { ref, computed, onMounted, watch } from 'vue'

const emit = defineEmits(['close', 'success'])
const props = defineProps<{
  idFasilitas: number | null
}>()

const form = ref({
  fasilitas_id: props.idFasilitas,
  jumlah: 0,
  harga_beli: 0,
  harga_jual: 0,
})

watch(
  () => props.idFasilitas,
  (val) => {
    form.value.fasilitas_id = val
  },
  { immediate: true },
)

const hargaBeliDisplay = ref('')
const hargaJualDisplay = ref('')

watch(
  () => form.value.harga_beli,
  (val) => {
    hargaBeliDisplay.value = formatRupiah(val)
  },
)

watch(
  () => form.value.harga_jual,
  (val) => {
    hargaJualDisplay.value = formatRupiah(val)
  },
)

watch(hargaBeliDisplay, (val) => {
  form.value.harga_beli = parseRupiah(val)
})

watch(hargaJualDisplay, (val) => {
  form.value.harga_jual = parseRupiah(val)
})

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

function parseRupiah(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, '')) || 0
}

const handleSubmit = async () => {
  try {
    const payload = {
      jumlah: form.value.jumlah,
      mst_fasilitas_id: form.value.fasilitas_id,
      harga_beli: form.value.harga_beli,
      harga_jual: form.value.harga_jual,
    }

    await add_stock(payload)
    emit('success')
  } catch (error: any) {
    console.error('Gagal tambah stok:', error)
    // Tambahin notifikasi atau alert di sini kalau perlu
  }
}
</script>
<template>
  <Form
    :formStatus="true"
    :label="' Tambah Stok Fasilitas'"
    :width="'w-full max-w-md'"
    :submitLabel="'Tambah Stok'"
    @cancel="emit('close')"
    @submit="handleSubmit"
  >
    <InputText
      v-model="form.jumlah"
      label="Jumlah"
      placeholder="Masukkan jumlah"
      class="mt-4"
      required
    />

    <InputText
      v-model="hargaBeliDisplay"
      label="Harga Beli"
      placeholder="Masukkan harga beli"
      class="mt-4"
      required
    />

    <InputText
      v-model="hargaJualDisplay"
      label="Harga Jual"
      placeholder="Masukkan harga jual"
      class="mt-4"
      required
    />
  </Form>
</template>
